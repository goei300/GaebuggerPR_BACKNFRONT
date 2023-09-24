from flask import Flask, request, Response
import json
import openai
from concurrent.futures import ThreadPoolExecutor
import functools
import os

# Module
from Search_Model import Search_Model
from Cutting import Cutting
from Matching import Matching
from Answer_Model import Answer_Model


app = Flask(__name__)

@app.route('/process-text', methods=['POST'])

def process_text():
    answer_text = ""

    if not request.json or 'text' not in request.json:
        return jsonify({'error': 'Data must be in JSON format and contain a "text" field.'}), 400

    text = request.json.get('text')
    print(text)

    # 임시로 내가 직접 저장 -> 나중에 파일 직접 업로드로 바꿀 예정
    with open("bob.txt", "w", encoding="utf-8") as file:
        file.write(text)

    title_dict, title_dict2 = Search_Model()
    result_dict = Cutting(text, title_dict, title_dict2)
    df = Matching(result_dict)
    answer_text = Answer_Model(df)

    print(answer_text)


    response_data = json.dumps({'result': answer_text}, ensure_ascii=False)
    return Response(response_data, content_type="application/json; charset=utf-8")
if __name__ == '__main__':
    app.run(port=5000)

