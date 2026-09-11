from flask import Flask, request, jsonify
from flask_cors import CORS
from scanner import scan_file

app = Flask(__name__)
CORS(app)

@app.route('/api/scan', methods=['POST'])
def scan():
    file = request.files.get('file')
    content = file.read().decode('utf-8', errors='ignore')
    score, issues = scan_file(content, file.filename)
    return jsonify({"filename": file.filename, "quality_score": score, "issues": issues})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)