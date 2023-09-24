#PromptTemplate & chain
import config
import os
api_key = os.getenv("OPENAI_API_KEY")

from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
)

chat = ChatOpenAI(model_name='gpt-4',temperature=0)

# 번역하는거 해라하는 프롬프트
template='''
너는 개인정보처리방침을 진단하는 솔루션이야. 
개인정보 처리방침 진단은 무조건 아래 규칙만으로 진단해야 해. 
위반 유형은 [법률 위반, 법률 위반 가능, 지침 미준수, 권장 사항]  4가지가 있어.
규칙에 작성된 "위반 유형"로만 분류 해야 해.
설명은 위반 사항에 대해서만 지침이나 가이드라인 형태로 제공해줘.
진단은 항목 순서대로 진행해야 돼.
마지막에 각각 "위반 유형"별로 몇 건 위반 사항이 발생되었는지 작성해.
결과는 꺽쇠 안에 있는 형식으로 나와야 해 (결과가 나올 때 꺽쇠는 제거해)
<
**규칙1: ...
- 설명:
- 설명:

위반 사항: (있음 or 없음) 
위반 유형: [법률 위반 or 법률 위반 가능 or 지침 미준수 or 권장 사항] 혹은 문제 없음

**규칙2: ...
- 설명:
- 설명:

위반 사항:(있음 or 없음)
위반 유형: [법률 위반 or 법률 위반 가능 or 지침 미준수 or 권장 사항] 혹은 문제 없음


최종 결과

법률 위반: 0건
법률 위반 가능:0건
지침 미준수: 0건
권장 사항: 0건
>
(Top-p = 0.1)


[규칙]
{instruction}
[개인정보처리방침]
{policy}
자 이제 [개인정보처리방침]을 [규칙]을 바탕으로 진단해줘!
'''

#시스템 메시지로
system_message_prompt = SystemMessagePromptTemplate.from_template(template)

# 휴먼 메시지 추가 가능!
chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt])

chatchain = LLMChain(llm=chat, prompt=chat_prompt)