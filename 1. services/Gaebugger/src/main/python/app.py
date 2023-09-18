from flask import Flask, request, Response
import json
import openai
from config import API_KEY
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
from CoreLogicModule import Matching_ALGO
import functools

openai.api_key = API_KEY

app = Flask(__name__)

@app.route('/process-text', methods=['POST'])
def process_text():
    answer_text = ""

    if not request.json or 'text' not in request.json:
        return jsonify({'error': 'Data must be in JSON format and contain a "text" field.'}), 400

    text = request.json.get('text')
    print(text)

    df = Matching_ALGO(text)
    with ThreadPoolExecutor(max_workers=5) as executor:
        func = functools.partial(get_response, df=df)
        answer_text = list(executor.map(func, range(len(df))))

    answer_text = "------------------------------------------------------------------------------------\n".join([ans for ans in answer_text if ans is not None])
    response_data = json.dumps({'result': answer_text}, ensure_ascii=False)
    return Response(response_data, content_type="application/json; charset=utf-8")

def create_prompt(i, df):
    if(df['keywords_matched'][i]!=''):
        target = '\"'+ df['keywords_matched'][i]+'\"'+"은 이 회사의 방침이야 그리고" + '\"'+ df['instruction'][i]+'\"' + "은 개인정보처리 지침이야"
        target += "개인정보처리 지침을 보고 이 회사의 방침에서 잘못된 부분이 있다면 찾아서 설명해줘!"
    else:
        target="No Question"
    return target

def get_response(i, df):
    gpt_prompt = create_prompt(i,df)
    if gpt_prompt != "No Question":
        message = [{"role": "user", "content": gpt_prompt}]
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=message,
            temperature=0.2,
            max_tokens=1000,
            frequency_penalty=0.0
        )
        return response['choices'][0]['message']['content']
    return None
if __name__ == '__main__':
    app.run(port=5000)