import os
from flask import Flask, jsonify
import requests
import json
from datetime import datetime, timedelta

app = Flask(__name__)

# Vercel 환경 변수에서 API 키를 안전하게 가져옵니다
NAVER_ID = os.environ.get('NAVER_CLIENT_ID')
NAVER_SECRET = os.environ.get('NAVER_CLIENT_SECRET')

def get_real_vitality_index():
    url = "https://openapi.naver.com/v1/datalab/search"
    # 어제와 오늘 날짜 설정
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    
    body = {
        "startDate": start_date, "endDate": end_date,
        "timeUnit": "date",
        "keywordGroups": [{"groupName": "만성피로", "keywords": ["만성피로", "피곤"]}]
    }
    headers = {
        "X-Naver-Client-Id": NAVER_ID,
        "X-Naver-Client-Secret": NAVER_SECRET,
        "Content-Type": "application/json"
    }
    
    try:
        res = requests.post(url, headers=headers, data=json.dumps(body))
        if res.status_code == 200:
            data = res.json()
            # 가장 최신 검색 비중(ratio) 가져오기
            latest_search_ratio = data['results'][0]['data'][-1]['ratio']
            
            # [전략 수식 적용]
            # Vitality Index = (Search Ratio * 0.6) + (Weather Weight * 0.4)
            weather_weight = 15.2 # 임시 기상 가중치 (추후 기상청 API 연동 예정)
            vitality_index = round((latest_search_ratio * 0.6) + (weather_weight * 0.4), 1)
            return vitality_index
    except Exception:
        return 50.0 # 에러 시 기본값
    return 50.0

@app.route('/api/health-data')
def health_data():
    return jsonify({
        "status": "success",
        "data": {
            "vitality": get_real_vitality_index(), # 진짜 데이터!
            "safety": 82.4, # 질병청 API 연동 예정
            "senior": 65.2, # 심평원 API 연동 예정
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M")
        }
    })