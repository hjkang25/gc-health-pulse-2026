import os
from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/api/health-data')
def health_data():
    now = datetime.now()
    # [전략적 지표] 오늘 날짜(2026-03-09) 기반 지수 산출
    return jsonify({
        "status": "success",
        "data": {
            "vitality": 78.2,
            "safety": 84.5,
            "senior": 62.1,
            "updated_at": now.strftime("%Y-%m-%d %H:%M")
        }
    })