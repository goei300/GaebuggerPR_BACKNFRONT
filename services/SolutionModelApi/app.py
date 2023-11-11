from flask import Flask, request, Response
import json
import openai
from concurrent.futures import ThreadPoolExecutor
import functools
import os
import sys
from config import config
openai.api_key = os.getenv("OPENAI_API_KEY")
pinecone_api_key = config.PINECONE_API_KEY
print(pinecone_api_key)

# Module & table 데이터
from Find_Question_Model.Search_Match_Omission_Model import Search_Match_Omission_Model, table

from Customized_ALGO.Cutting import *
from Customized_ALGO.Matching import *
from Find_Answer_Model.Answer_Model import *
from Find_Answer_Model.Answer_Frame import *
from Find_Question_Model.User_Input_Check import *

# 벡터 DB관련
from llama_index import SimpleDirectoryReader
import pinecone
from llama_index import GPTVectorStoreIndex, StorageContext
from llama_index.vector_stores.pinecone import PineconeVectorStore


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

    text = text.replace("'","") # 안에 작은따옴표들 전부제거
    text = text.replace('"', "") # 안에 큰따옴표들 전부제거

    print("들어온 처리방침: ", text)

    # 들어온 세번째 데이터(user_input) : 유저가 체크한 사항
    user_input = request.json.get('user_input')
    print("들어온 유저의 체크박스: ", user_input)

    # 테스트에서만 임시로 저장
    with open("./policy.txt", "w", encoding="utf-8") as file:
        file.write(text)


    # <내부 알고리즘 동작>
    title_dict, title_dict2, omission_text, unique_title_dict , unique_title_dict2, df, process_Omission_Paragraph, omission_Issues, issue_id= Search_Match_Omission_Model(user_input)



    print("추출한 '고유 대제목'과 그에 해당하는 룰\n")
    print(unique_title_dict,"\n")
    print(unique_title_dict2,"\n")

    result_dict = Cutting(text, unique_title_dict, unique_title_dict2, table) # 여기서 목차여부 넘기는데 나중에 객체지향설계로 상속하도록 할 예정
    print("룰과 파트내용 매칭된 딕셔너리 {rule:파트}\n")
    print(result_dict)

    df = Matching(text, result_dict, df)
    print("Matching에서 완성된 데이터프레임입니다!")
    print(df[['user_input', 'part', 'matched_part', 'matched_startIndex']])

    ### Answer 주는 부분

    answer_text, process_Paragraph,process_Issues, process_Law_Violate, process_Law_Danger, process_Guide_Violate = Answer_Frame(df, text, issue_id)
    
    # <출력사항>
    omission_text = "*<누락 관련 사항>*\n" + omission_text+"\n\n"
    final_answer_text = omission_text + answer_text
    print(final_answer_text)

    # 벡터 DB 파트 주석처리 실제 정확한 Answer만 insert
    '''
    # 벡터 DB에 answer_text를 insert
    ## 1. answer를 {process_Id}.txt로 data폴더에 저장 후 모든 파일 재업로드
    answer_text="이렇게 하시오."
    with open("./data/{}.txt".format(process_Id), "w", encoding="utf-8") as file:
        file.write(answer_text)
    documents = SimpleDirectoryReader("./data").load_data()
    print(documents)
    ## 2. 파인콘 벡터 DB 시작
    ## 인덱스 이름은 PriPen
    pinecone.init(api_key=pinecone_api_key, environment="gcp-starter")

    ## 3. data폴더의 txt들을 전부 임베딩하여 PineCone의 PriPen 인덱스에 저장
    pinecone_index = pinecone.Index("pripen")  # 벡터 DB 인덱스 이름 PriPen으로 설정
    vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    index = GPTVectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context
    )
    '''
    # <JSON 데이터>
    # 백엔드로 넘길 json데이터 구조
    backend_json = {"process_Id":process_Id, "process_Original":text, "process_Score":0, "process_Law_Violate":0, "process_Law_Danger": 0,
                    "process_Guide_Violate": 0, "process_Omission_Paragraph" : 0,  "process_Paragraph": [],  "process_Issues":[], "process_Modified": ""}


    backend_json["process_Law_Violate"]=process_Law_Violate
    backend_json["process_Law_Danger"] = process_Law_Danger
    backend_json["process_Guide_Violate"] = process_Guide_Violate
    backend_json["process_Omission_Paragraph"] = process_Omission_Paragraph
    backend_json["process_Paragraph"] = process_Paragraph
    backend_json["process_Issues"] = omission_Issues
    backend_json["process_Issues"] += process_Issues
    # backend_json["process_Modified"] = process_Modified

    '''
    # paragraph_id 순으로 정렬
    sorted_Issues = sorted(backend_json["process_Issues"], key=lambda x: x['issue_paragraph_id'])
    backend_json["process_Issues"] = sorted_Issues
    '''

    print("<최종 추출된 JSON 데이터>", backend_json)
    response_data = json.dumps(backend_json, ensure_ascii=False)
    return Response(response_data, content_type="application/json; charset=utf-8")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
