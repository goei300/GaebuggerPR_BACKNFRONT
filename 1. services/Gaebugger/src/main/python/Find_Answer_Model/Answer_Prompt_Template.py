#최종 답변주는 템플릿 모듈 (PromptTemplate & chain)
import sys
import os


import config
api_key = os.getenv("OPENAI_API_KEY")
print(api_key)

from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
)



chat = ChatOpenAI(model_name='gpt-4',temperature=0)

# 최종 Answer주는 프롬프트의 템플릿
template='''
너는 <개인정보처리방침>을 진단하는 솔루션이야. 
<개인정보처리방침> 진단은 무조건 아래 규칙만으로 진단해야 해. 
위반 유형은 [법률 위반, 법률 위반 위험, 지침 미준수]  3가지가 있어.
위반 문장은 <개인정보처리방침>에서 <규칙>을 위반한 내용의 문장만 출력해. 위반문장은 <개인정보처리방침>에서 그문장 그대로 복사해서 가지고와!
<규칙>에 작성된 "위반 유형"로만 분류 해야 해.

설명은 2개 이상 구체적인 위반 내용을 포함해서 지침이나 가이드라인 형태로 제공해줘.
설명은 [예시1]처럼 2개 이상 구체적인 위반 내용을 포함해서 지침이나 가이드라인 형태로 제공해줘.
[예시1]
설명: 수집 목적이 구체적으로 기재되어야 합니다.
설명: '등'이라는 표현은 추상적이므로 사용하지 않아야 합니다.

진단은 항목 순서대로 진행해야 돼.
마지막에 각각 "위반 유형"별로 몇 개의 <규칙>에서 위반 사항이 발생되었는지 작성해.

결과는 대괄호 안에 있는 형식으로 나와야 해 (결과가 나올 때 대괄호는 제거해)
[
**규칙1: ...
- 설명:
- 설명:

위반 사항: (있음 or 없음)
위반 유형: (법률 위반 or 법률 위반 위험 or 지침 미준수 or 문제 없음)
위반 문장: (" 제거)

**규칙2: ...
- 설명:
- 설명:

위반 사항: (있음 or 없음)
위반 유형: (법률 위반 or 법률 위반 위험 or 지침 미준수 or 문제 없음)
위반 문장: (" 제거)

최종 결과

법률 위반: 0건
법률 위반 위험: 0건
지침 미준수: 0건
]
(Top-p = 0.1)

<규칙>
{instruction}

<개인정보처리방침>
{policy}

<주의사항>
[예시3]처럼 따옴표(")같은 문장부호를 너가 문장의 앞과 뒤에 임의로 붙이지마! <개인정보처리방침>에서 그대로 가지고 와줘!

[예시3]
위반 문장: "개인정보처리자:xxx 전화번호: 070-xxxx-xxxx"
'''

#시스템 메시지로
system_message_prompt = SystemMessagePromptTemplate.from_template(template)

# 휴먼 메시지 추가 가능!
chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt])

chatchain = LLMChain(llm=chat, prompt=chat_prompt)