import openai
import ast

# lang chain
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter

# Module
from Search_Prompt import create_prompt_only, create_prompt_part, create_prompt_part_last

import config
import os
openai.api_key = os.getenv("OPENAI_API_KEY")

rule = ['개인정보처리방침', '개인정보의 처리 목적', '개인정보의 처리 및 보유 기간', '처리하는 개인정보의 항목',
        '만 14세 미만 아동의 개인정보 처리에 관한 사항','개인정보의 제3자 제공에 관한 사항','개인정보 처리업무의 위탁에 관한 사항','개인정보의 국외 이전에 관한 사항',
        '개인정보의 파기 절차 및 방법에 관한 사항','미이용자의 개인정보 파기 등에 관한 조치','정보주체와 법정대리인의 권리·의무 및 행사방법에 관한 사항','개인정보의 안전성 확보조치에 관한 사항','개인정보를 자동으로 수집하는 장치의 설치·운영 및 그 거부에 관한 사항',
        '행태정보의 수집·이용·제공 및 거부 등에 관한 사항','추가적인 이용·제공 관련 판단 기준','가명정보 처리에 관한 사항','개인정보 보호책임자에 관한 사항','국내대리인 지정에 관한 사항','개인정보의 열람청구를 접수·처리하는 부서','정보주체의 권익침해에 대한 구제방법',
        '영상정보처리기기 운영·관리에 관한 사항','개인정보 처리방침의 변경에 관한 사항']

def Search_Model():
    # 저장한 txt파일(사용자 인풋) 불러옴
    loader = TextLoader("./bob.txt", encoding='utf-8')
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=4096, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)

    for i in range(0, len(docs)):

        if (len(docs) > 1):
            if (i == len(docs) - 1):
                gpt_prompt = create_prompt_part_last(docs[i].page_content, rule)
                message = [{"role": "user", "content": gpt_prompt}]
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=message,
                    temperature=0.2,
                    max_tokens=4096,
                    frequency_penalty=0.0
                )
                title_dict = ast.literal_eval((response['choices'][0]['message']['content']))
            else:
                gpt_prompt = create_prompt_part(docs[i].page_content)

                message = [{"role": "user", "content": gpt_prompt}]
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=message,
                    temperature=0.2,
                    max_tokens=4096,
                    frequency_penalty=0.0
                )

        else:
            gpt_prompt = create_prompt_only(docs[i].page_content, rule)

            message = [{"role": "user", "content": gpt_prompt}]
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=message,
                temperature=0.2,
                max_tokens=4096,
                frequency_penalty=0.0
            )
            title_dict = ast.literal_eval((response['choices'][0]['message']['content']))

    title_dict2 = {value: key for key, value in title_dict.items()}
    return title_dict, title_dict2  # 딕셔너리 형태로 2개 반환

    ##################
    ### title_dict = {방침의 대제목: 지침의 대제목}
    ### title_dict2 = {지침의 대제목: 방침의 대제목}

