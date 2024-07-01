from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config

app = Flask(__name__)
db = Config()
CORS(app)

@app.route('/')
def hello():
    conn = db.get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT version();')
    db_version = cursor.fetchone()
    cursor.close()
    conn.close()
    return f"Hello, World! XD versionn: {db_version[0]}"

@app.route('/upload-video', methods=['POST'])
def upload_video():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    file.save('uploads/' + file.filename)

    return jsonify({'message': 'File uploaded successfully'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)