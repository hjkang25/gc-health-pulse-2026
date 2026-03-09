import os
import requests
from flask import Flask, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)

# ─────────────────────────────────────────
# 환경 변수
# ─────────────────────────────────────────
DATA_GO_KR_KEY  = os.environ.get('DATA_GO_KR_API_KEY')   # 공공데이터포털
NAVER_ID        = os.environ.get('NAVER_CLIENT_ID')       # 네이버 데이터랩
NAVER_SECRET    = os.environ.get('NAVER_CLIENT_SECRET')   # 네이버 데이터랩

# 기상청 API 기본 좌표 (서울 기준 nx=60, ny=127)
NX, NY = 60, 127


# ─────────────────────────────────────────
# [1] 기상청 단기예보 데이터
# ─────────────────────────────────────────
def get_weather_data():
    """
    기상청 단기예보 API에서 최저기온(TMN), 최고기온(TMX), 현재기온(TMP) 추출
    반환: { t_min, t_max, t_current, temp_diff }
    """
    try:
        now = datetime.now()
        base_date = now.strftime('%Y%m%d')
        # 기상청 예보 발표 시각: 02, 05, 08, 11, 14, 17, 20, 23시
        hour = now.hour
        base_hours = [2, 5, 8, 11, 14, 17, 20, 23]
        base_hour = max([h for h in base_hours if h <= hour], default=23)
        base_time = f"{base_hour:02d}00"

        url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"
        params = {
            'serviceKey': DATA_GO_KR_KEY,
            'numOfRows': 300,
            'pageNo': 1,
            'dataType': 'JSON',
            'base_date': base_date,
            'base_time': base_time,
            'nx': NX,
            'ny': NY
        }
        res = requests.get(url, params=params, timeout=5)
        items = res.json()['response']['body']['items']['item']

        t_min, t_max, t_current = None, None, None
        for item in items:
            if item['category'] == 'TMN' and t_min is None:
                t_min = float(item['fcstValue'])
            if item['category'] == 'TMX' and t_max is None:
                t_max = float(item['fcstValue'])
            if item['category'] == 'TMP' and t_current is None:
                t_current = float(item['fcstValue'])

        temp_diff = round(t_max - t_min, 1) if t_max and t_min else 10.0
        return {
            't_min': t_min or 5.0,
            't_max': t_max or 15.0,
            't_current': t_current or 10.0,
            'temp_diff': temp_diff
        }
    except Exception as e:
        print(f"[날씨 API 오류] {e}")
        # 오류 시 fallback 기본값
        return {'t_min': 5.0, 't_max': 15.0, 't_current': 10.0, 'temp_diff': 10.0}


# ─────────────────────────────────────────
# [2] 네이버 데이터랩 검색 트렌드
# ─────────────────────────────────────────
def get_naver_fatigue_trend():
    """
    '만성피로', '번아웃' 검색량 트렌드 → 0~100 점수 반환
    최근 7일 평균 대비 오늘 상대값
    """
    try:
        url = "https://openapi.naver.com/v1/datalab/search"
        headers = {
            'X-Naver-Client-Id': NAVER_ID,
            'X-Naver-Client-Secret': NAVER_SECRET,
            'Content-Type': 'application/json'
        }
        end_date   = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')

        body = {
            "startDate": start_date,
            "endDate": end_date,
            "timeUnit": "date",
            "keywordGroups": [
                {"groupName": "피로번아웃", "keywords": ["만성피로", "번아웃", "피로회복"]}
            ]
        }
        res = requests.post(url, headers=headers, json=body, timeout=5)
        data = res.json()

        ratios = [d['ratio'] for d in data['results'][0]['data']]
        avg = sum(ratios) / len(ratios) if ratios else 50
        latest = ratios[-1] if ratios else 50

        # 검색량이 평균보다 높을수록 피로도 높음 → 0~100 정규화
        score = round(min(100, max(0, (latest / avg) * 50)), 1)
        return score
    except Exception as e:
        print(f"[네이버 API 오류] {e}")
        return 50.0


# ─────────────────────────────────────────
# [3] KDCA 감염병 데이터 (영유아 안심지수)
# ─────────────────────────────────────────
def get_kdca_infection_score():
    """
    공공데이터포털 KDCA 감염병 현황 API → 위험 점수 반환
    수족구, 인플루엔자, RSV 발생건수 기반
    """
    try:
        url = "http://apis.data.go.kr/1790387/InfectioDiseaseStat/getInfectioDiseaseStat"
        params = {
            'serviceKey': DATA_GO_KR_KEY,
            'numOfRows': 10,
            'pageNo': 1,
            'sickCd': 'ST'  # 수족구병 코드
        }
        res = requests.get(url, params=params, timeout=5)
        items = res.json().get('response', {}).get('body', {}).get('items', {}).get('item', [])

        if not items:
            return 70.0

        # 가장 최근 발생 건수
        latest = items[0]
        count = float(latest.get('cnt', 0))

        # 발생건수 많을수록 위험 → 안심지수는 낮아짐
        # 기준: 1000건 이상이면 위험(30점), 100건 이하면 안전(90점)
        safety = round(max(30, min(95, 95 - (count / 1000) * 65)), 1)
        return safety
    except Exception as e:
        print(f"[KDCA API 오류] {e}")
        return 70.0


# ─────────────────────────────────────────
# 지수 산출 로직
# ─────────────────────────────────────────
def calc_vitality_index(fatigue_score, temp_diff):
    """
    Iv = (S_fatigue × 0.6) + (W_temp_diff × 0.4)
    temp_diff → 일교차 클수록 스트레스 가중치 증가 (0~100 정규화)
    """
    # 일교차 가중치: 15°C 이상이면 100점, 0°C면 0점
    w_temp = min(100, (temp_diff / 15) * 100)
    iv = round((fatigue_score * 0.6) + (w_temp * 0.4), 1)
    return iv


def calc_senior_vascular_risk(t_min, temp_diff):
    """
    Risk = f(T_min, ΔT)
    기온 1°C 하락 → 수축기 혈압 1.3mmHg 상승 근거 반영
    최저기온이 낮을수록, 일교차가 클수록 위험
    """
    # 최저기온 위험도: 0°C 이하 = 100, 20°C 이상 = 0
    temp_risk = max(0, min(100, (20 - t_min) * 5))
    # 일교차 위험도: 15°C 이상 = 100
    diff_risk = min(100, (temp_diff / 15) * 100)
    # 종합 (최저기온 70%, 일교차 30%)
    risk = round((temp_risk * 0.7) + (diff_risk * 0.3), 1)
    return risk


# ─────────────────────────────────────────
# API 엔드포인트
# ─────────────────────────────────────────
@app.route('/api/health-data')
def health_data():
    now = datetime.now()

    # 실데이터 수집
    weather       = get_weather_data()
    fatigue_score = get_naver_fatigue_trend()
    safety_score  = get_kdca_infection_score()

    # 지수 산출
    vitality_index = calc_vitality_index(fatigue_score, weather['temp_diff'])
    senior_risk    = calc_senior_vascular_risk(weather['t_min'], weather['temp_diff'])

    return jsonify({
        "status": "success",
        "data": {
            # 세 가지 핵심 지수
            "vitality": vitality_index,        # 직장인 활력저하 지수
            "safety": safety_score,            # 영유아 안심 지수
            "senior": senior_risk,             # 시니어 혈관 경보

            # 원시 데이터 (디버깅 및 화면 추가 표시용)
            "weather": {
                "t_current": weather['t_current'],
                "t_min": weather['t_min'],
                "t_max": weather['t_max'],
                "temp_diff": weather['temp_diff']
            },
            "updated_at": now.strftime("%Y-%m-%d %H:%M")
        }
    })


if __name__ == '__main__':
    app.run(debug=True)