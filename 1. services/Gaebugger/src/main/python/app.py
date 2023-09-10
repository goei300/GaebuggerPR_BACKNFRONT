from flask import Flask, request, Response
import json
import openai

openai.api_key = 'my_api'

app = Flask(__name__)

@app.route('/process-text', methods=['POST'])
def process_text():
    if not request.json or 'text' not in request.json:
        return jsonify({'error': 'Data must be in JSON format and contain a "text" field.'}), 400

    text = request.json.get('text')
    ans = openai.Completion.create(prompt=text, model="ft:gpt-3.5-turbo-0613:personal::7wlc040J")

    response_data = json.dumps({'result': ans}, ensure_ascii=False)
    response = Response(response_data, content_type="application/json; charset=utf-8")
    return response
if __name__ == '__main__':
    app.run(port=5000)

if __name__ == "__main__":
    app.run(debug=True, port=5000)