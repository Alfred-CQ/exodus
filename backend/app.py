import os
from flask import Flask, request, jsonify, send_from_directory
import requests
from flask_cors import CORS
from config import Config
from werkzeug.utils import secure_filename
from AWS.S3VideoSender import S3VideoSender
import psycopg2
from utils import MP4toMP3Converter, save_video

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
JSONS_FOLDER = 'jsons'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['JSONS_FOLDER'] = JSONS_FOLDER
db = Config()
CORS(app)


os.makedirs(JSONS_FOLDER, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
s3_sender = S3VideoSender(origin_path='./uploads/')
PUBLIC_URL= "https://exodus-bucket-test2.s3.amazonaws.com/"
LOCAL_URL= "http://localhost:5000/"

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

    if 'imgThumbnail' not in request.files:
        return jsonify({'error': 'No thumbnail part in the request'}), 400

    processing_type = request.form.get('processing_type')
    file = request.files['file']
    imgThumbnail = request.files['imgThumbnail']

    imgName = secure_filename(LOCAL_URL +  imgThumbnail.filename)
    img_path = os.path.join(app.config['UPLOAD_FOLDER'], imgName)
    imgThumbnail.save(img_path)

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file_bytes = file.read()

    file_name = PUBLIC_URL + os.path.splitext(file.filename)[0]

    if processing_type == 'video':
        file_name = file_name + '_results_mp4.json'
    elif processing_type == 'audio':
        file_name = file_name + '_results_mp3.json'

    conn = None
    try:
        conn = db.get_db_connection()
        cursor = conn.cursor()

        cursor.execute('INSERT INTO files_api (file_name, img_path) VALUES (%s, %s)', (file_name, img_path,))
        conn.commit()

        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return jsonify({'error': f'Database error: {error}'}), 500
    finally:
        if conn is not None:
            conn.close()

    if processing_type == 'video':
        print('XD 1')
        s3_sender.send_object_to_s3(file_bytes, file.filename)
        print('XD 2')
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


@app.route('/files', methods=['GET'])
def get_files():
    conn = None
    try:
        conn = db.get_db_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM files_api;')
        records = cursor.fetchall()

        cursor.close()

        files_list = []
        for record in records:
            file_name = record[1]
            json_file_name = os.path.basename(file_name)
            json_local_path = os.path.join(JSONS_FOLDER, json_file_name)
            download_and_save_json(file_name, json_local_path)

            files_list.append({
                'id': record[0],
                'file_name': f"{LOCAL_URL}jsons/{json_file_name}",
                'imgSrc': record[2]
            })

        return jsonify(files_list), 200

    except (Exception, psycopg2.DatabaseError) as error:
        return jsonify({'error': f'Database error: {error}'}), 500

    finally:
        if conn is not None:
            conn.close()


@app.route('/uploads/<filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/jsons/<filename>')
def serve_json(filename):
    return send_from_directory(app.config['JSONS_FOLDER'], filename)


def download_and_save_json(url, local_path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(local_path, 'w') as f:
            f.write(response.text)
    else:
        raise Exception(f"Failed to download JSON from {url}, status code: {response.status_code}")


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
