import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config

app = Flask(__name__)
db = Config()
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def hello():
    conn = db.get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT version();')
    db_version = cursor.fetchone()
    cursor.close()
    conn.close()
    return f"Hello, World! XD version: {db_version[0]}"

@app.route('/upload-to-exodus', methods=['POST'])
def upload_to_exodus():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    return jsonify({'message': 'File uploaded successfully to Exodus', 'file_path': file_path}), 200

@app.route('/upload-to-aws', methods=['POST'])
def upload_to_aws():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    return jsonify({'message': 'File uploaded successfully to AWS', 'file_path': file_path}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
