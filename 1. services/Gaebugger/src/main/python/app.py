from flask import Flask, request, Response
import json
import openai
from concurrent.futures import ThreadPoolExecutor
import functools
import os
import sys

# Module & table 데이터
from Find_Question_Model.Search_Match_Omission_Model import Search_Match_Omission_Model, table

from Customized_ALGO.Cutting import *
from Customized_ALGO.Matching import *
from Find_Answer_Model.Answer_Model import *
from Find_Answer_Model.Answer_CoT_SC import *
from Find_Question_Model.User_Input_Check import *

app = Flask(__name__)

@app.route('/process-text', methods=['POST'])

def process_text():
    if not request.json:
        return jsonify({'error': 'Data must be in JSON format'}), 400
    elif 'process_Id' not in request.json:
        return jsonify({'error': 'Process ID must be in JSON format'}), 400
    elif 'text' not in request.json:
        return jsonify({'error': 'Company Policy must be in JSON format'}), 400
    elif 'user_input' not in request.json:
        return jsonify({'error': 'Check Box must be in JSON format'}), 400

    # 들어온 첫번째 데이터(process_Id) : 서비스 이용자 고유값
    process_Id = request.json.get('process_Id')
    print("서비스 이용자 고유 ID: ", process_Id)

    # 들어온 두번째 데이터(text) : 회사의 처리방침
    text = request.json.get('text')
    print("들어온 처리방침: ", text)

    # 들어온 세번째 데이터(user_input) : 유저가 체크한 사항
    user_input = request.json.get('user_input')
    print("들어온 유저의 체크박스: ", user_input)

    # 테스트에서만 임시로 저장
    with open("./policy.txt", "w", encoding="utf-8") as file:
        file.write(text)


    # <내부 알고리즘 동작>
    title_dict, title_dict2, omission_text, unique_title_dict , unique_title_dict2, df= Search_Match_Omission_Model(user_input)

    print("추출한 '고유 대제목'과 그에 해당하는 룰\n")
    print(unique_title_dict,"\n")
    print(unique_title_dict2,"\n")

    result_dict = Cutting(text, unique_title_dict, unique_title_dict2, table) # 여기서 목차여부 넘기는데 나중에 객체지향설계로 상속하도록 할 예정
    print("룰과 파트내용 매칭된 딕셔너리 {rule:파트}\n")
    print(result_dict)

    df = Matching(result_dict, df)
    print("최종 완성된 데이터프레임입니다!")
    print(df[['user_input', 'part', 'matched_part']])
    answer_text, process_Paragraph,process_Issues, process_Law_Violate, process_Law_Danger, process_Guide_Violate = Answer_CoT_SC(df, text)

    # <출력사항>
    omission_text = "*<누락 관련 사항>*\n" + omission_text+"\n\n"
    answer_text = omission_text + answer_text
    print(answer_text)


    # <JSON 데이터>
    # 백엔드로 넘길 json데이터 구조
    backend_json = {"process_Id":process_Id, "process_Original":text, "process_Law_Violate":0, "process_Law_Danger": 0,
                    "process_Guide_Violate": 1, "process_Paragraph": [],  "process_Issues":[], "process_Modified":""}

    backend_json["process_Law_Violate"]=process_Law_Violate
    backend_json["process_Law_Danger"] = process_Law_Danger
    backend_json["process_Guide_Violate"] = process_Guide_Violate
    backend_json["process_Paragraph"] = process_Paragraph
    backend_json["process_Issues"] = process_Issues

    print("<최종 추출된 JSON 데이터>", backend_json)
    response_data = json.dumps(backend_json, ensure_ascii=False)
    return Response(response_data, content_type="application/json; charset=utf-8")


if __name__ == '__main__':
    app.run(port=5000)
