from flask import Flask, request, Response
import json
import openai

openai.api_key = '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'

app = Flask(__name__)

@app.route('/process-text', methods=['POST'])
def process_text():
    if not request.json or 'text' not in request.json:
        return jsonify({'error': 'Data must be in JSON format and contain a "text" field.'}), 400

    text = request.json.get('text')
    print(text)
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": text}
        ]
    )
    message_output = response.choices[0].message.content
    print(message_output)

    response_data = json.dumps({'result': message_output}, ensure_ascii=False)
    return Response(response_data, content_type="application/json; charset=utf-8")
if __name__ == '__main__':
    app.run(port=5000)

