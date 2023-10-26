import sys
import os


import config
api_key = os.getenv("OPENAI_API_KEY")

from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
)

chat = ChatOpenAI(model_name='gpt-4',temperature=0)

# 리스트로 뽑은 대제목 결과를 다시 검증하는 프롬프트 -> (추후 개보팀과 논의 필요할수도...)
# 1) 리스트로 뽑은 대제목을 input으로 줌
# 2) 텍스트 랑 rule 다시주고 맞는지 재확인해줘

template='''
{}
'''

#시스템 메시지로
system_message_prompt = SystemMessagePromptTemplate.from_template(template)

# 휴먼 메시지 추가 가능!
chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt])

chatchain = LLMChain(llm=chat, prompt=chat_prompt)