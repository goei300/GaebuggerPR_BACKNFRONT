import pandas as pd
import sys
import os


import config
import warnings
warnings.filterwarnings("ignore", category=UserWarning)
api_key = os.getenv("OPENAI_API_KEY")

# Module
# from .Answer_Prompt_Template import chatchain

from .Answer_Prompt_Template import Answer_Template
from .Rule_Validation.Rule_Validation import checking_answer_template
from .Make_Json import Make_Issues, Make_Paragraph

# Async
import time
import asyncio

from langchain.llms import OpenAI

answer = []
async def async_generate(llm, policy, instruction):
    global answer
    resp = await llm.agenerate([Answer_Template(policy, instruction)])
    answer.append(resp.generations[0][0].text)

async def generate_concurrently(df, n):
    llm = OpenAI(temperature=0, model_name = 'gpt-4')
    tasks = [async_generate(llm, df['matched_part'][i], df['instruction'][i]) for i in range(n)]
    await asyncio.gather(*tasks)

# 최종 답변 주는 함수
# 1. 최종 답변 주는 LLM질의
# 2. 백엔드로 넘길 JSON 데이터의 중요한 부분 반환
def Answer_Model(df, text):

    # 최종 위반 결과(법률위반, 법률위반가능, 지침위반, 권장사항)
    process_Law_Violate = 0
    process_Law_Danger = 0
    process_Guide_Violate = 0

    # 계속 위반한 규칙들이 들어갈 리스트
    process_Issues = []


    ans = ""

    asyncio.run(generate_concurrently(df, len(df)))

    global answer
    print(answer)

    issue_id_num = 0
    for i in range(len(df)):

        # 최종 질의 프롬프트가 LLM에 Input으로 들어감 -> answer에서 결과 나옴
        #answer = chatchain.run(policy=df['matched_part'][i], instruction=df['instruction'][i])

        # ans는 그냥 결과 보여주기 위함
        ans += str(i+1)+">" +" " + "instruction: " + df['part'][i] + "에 해당하는 가이드라인은 이렇습니다." + "\n" + answer[i] + "\n\n\n\n"

        # Make_Issues 함수를 통해 Json형식에 들어갈 데이터 추출
            # issue_json은 리스트 형태로 된 각 규칙으 딕셔너리 집합체 [{}, {}, {}]
        issue_json, process_Law_Violate_temp, process_Law_Danger_temp, process_Guide_Violate_temp, issue_id_num = Make_Issues(answer[i], i, text, df, issue_id_num)

        process_Law_Violate += process_Law_Violate_temp
        process_Law_Danger += process_Law_Danger_temp
        process_Guide_Violate += process_Guide_Violate_temp

        # 계속 리스트에 추가해감
        process_Issues += issue_json


    process_Paragraph = Make_Paragraph(df, text)

    print("Make_Issues의 최종결과입니다.", process_Issues)
    print("Make_Paragraph의 최종결과입니다.", process_Paragraph)

    return ans, process_Paragraph,process_Issues, process_Law_Violate, process_Law_Danger, process_Guide_Violate