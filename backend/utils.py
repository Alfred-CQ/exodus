from moviepy.editor import VideoFileClip

def save_video(video_bytes, filename):
    with open(filename, 'wb') as f:
        f.write(video_bytes)

class MP4toMP3Converter():
    def __init__(self, prefix='./'):
        self.prefix = prefix
        
    def convert_and_save(self, mp4_filename):
        mp4_filepath = self.prefix + mp4_filename
        mp3_filename = mp4_filename.split('.')[0] + '.mp3'

        videoclip = VideoFileClip(mp4_filepath)
        audioclip = videoclip.audio
        
        audioclip.write_audiofile(mp3_filename)
        audioclip.close()
        videoclip.close()
        
        return mp3_filename