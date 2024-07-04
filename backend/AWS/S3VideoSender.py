import io
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from dotenv import load_dotenv

class S3VideoSender():
    def __init__(self, bucket_name='exodus-bucket-test2', origin_path = './', ):
        load_dotenv()
        self.origin_path = origin_path
        self.bucket_name = bucket_name
        self.s3 = boto3.client('s3')
    
    def send_to_s3(self, file_name):
        file_path = self.origin_path + file_name
        try:
            with open(file_path, 'rb') as f:
                video_bytes = f.read()
        except FileNotFoundError:
            print(f"File {file_path} not found.")

        self.send_object_to_s3(video_bytes, file_name)
        
    def send_object_to_s3(self, obj_bytes, file_name):
        obj_bytes_io = io.BytesIO(obj_bytes)
        s3_file_name = file_name
        print('XD inside')
        try:
            self.s3.upload_fileobj(obj_bytes_io, self.bucket_name, s3_file_name)
            print(f'File {file_name} load to {self.bucket_name} as {s3_file_name}')
        except FileNotFoundError:
            print("File not found")
        except NoCredentialsError:
            print("Credentials were not found")
        except ClientError as e:
            print(f"An error occurred: {e}")