from flask import Flask, request, Response
import json
from config import API_KEY
import openai
import pandas as pd

openai.api_key = API_KEY
df = pd.read_csv("./test_instruction.csv")

app = Flask(__name__)

@app.route('/process-text', methods=['POST'])

def create_prompt(text, i):
    target = text
    target = '\"'+ target+'\"'+"은 이 회사의 방침이야 그리고" + '\"'+ df['instruction'][i]+'\"' + "은 개인정보처리 지침이야"
    target += "개인정보처리 지침을 보고 이 회사의 방침에서 잘못된 부분이 있다면 찾아서 설명해줘!"
    return target

def process_text():
    
    answer_text = ""
    
    if not request.json or 'text' not in request.json:
        return jsonify({'error': 'Data must be in JSON format and contain a "text" field.'}), 400

    text = request.json.get('text')
    print(text)

    for i in range(0, len(df)):
        gpt_prompt = create_prompt(text, i)

        message=[{"role": "user", "content": gpt_prompt}]
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages = message,
            temperature=0.2,
            max_tokens=1000,
            frequency_penalty=0.0
        )
        answer_text += (response['choices'][0]['message']['content'] + "\n")
    response_data = json.dumps({'result': answer_text}, ensure_ascii=False)
    return Response(response_data, content_type="application/json; charset=utf-8")
if __name__ == '__main__':
    app.run(port=5000)

