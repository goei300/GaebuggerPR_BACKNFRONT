from flask import Flask, request, Response
import json

app = Flask(__name__)

@app.route('/process-text', methods=['POST'])
def process_text():
    if not request.json or 'text' not in request.json:
        return jsonify({'error': 'Data must be in JSON format and contain a "text" field.'}), 400

    text = request.json.get('text')

    # Split the text into sentences
    sentences = [s.strip() for s in text.split('.') if s]

    # Filter out sentences containing the word 'thanks'
    thanks_sentences = [s for s in sentences if '안녕' in s.lower()]

    response_data = json.dumps({'result': thanks_sentences}, ensure_ascii=False)
    response = Response(response_data, content_type="application/json; charset=utf-8")
    return response
if __name__ == '__main__':
    app.run(port=5000)