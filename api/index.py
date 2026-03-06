from flask import Flask, jsonify
import requests
import json
from datetime import datetime

app = Flask(__name__)

@app.route('/api/health-data')
def get_health_data():
    # [전략 수식] 활력 저하 지수 산출 로직
    # I_v = (검색량 * 0.6) + (기온차 * 0.4)
    # 실제 네이버 API 연동 전, 실시간 데이터를 시뮬레이션합니다.
    
    vitality_index = 72.8  # 직장인 활력 지수
    safety_index = 85.1    # 영유아 안심도
    senior_risk = 42.0     # 시니어 혈관 주의보
    
    return jsonify({
        "status": "success",
        "data": {
            "vitality": vitality_index,
            "safety": safety_index,
            "senior": senior_risk,
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    })

if __name__ == '__main__':
    app.run(debug=True)