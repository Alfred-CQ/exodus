import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from AWS.S3VideoSender import S3VideoSender

from utils import MP4toMP3Converter, save_video

app = Flask(__name__)
db = Config()
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
s3_sender = S3VideoSender(origin_path='./uploads/')

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

    processing_type = request.form.get('processing_type')
    file = request.files['file']

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file_bytes = file.read()
    
    if processing_type == 'video':
        s3_sender.send_object_to_s3(file_bytes, file.filename)
        return jsonify(
            {'message': 'Video uploaded successfully to AWS',
             'file_path': file_path,
             'processing_type': processing_type
             } ), 200
    elif processing_type == 'audio':
        save_video(file_bytes, file.filename)
        converter = MP4toMP3Converter()
        mp3_filename = converter.convert_and_save(file.filename)    
        with open(mp3_filename, "rb") as f:
            mp3_bytes = f.read()
        s3_sender.send_object_to_s3(mp3_bytes, mp3_filename)
        
        return jsonify(
            {'message': 'Audio uploaded successfully to AWS',
             'file_path': file_path,
             'processing_type': processing_type
             } ), 200
        
    elif processing_type == 'both':
        s3_sender.send_object_to_s3(file_bytes, file.filename)
        
        save_video(file_bytes, file.filename)
        converter = MP4toMP3Converter()
        mp3_filename = converter.convert_and_save(file.filename)    
        with open(mp3_filename, "rb") as f:
            mp3_bytes = f.read()
        s3_sender.send_object_to_s3(mp3_bytes, mp3_filename)
        
        return jsonify(
            {'message': 'Files uploaded successfully to AWS',
             'file_path': file_path,
             'processing_type': processing_type
             } ), 200
        
    else:
        return jsonify(
            {'message': 'Not accepted processing type',
             'processing_type': processing_type
             } ), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
