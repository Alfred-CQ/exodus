FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt requirements.txt

RUN apt-get update && \
    pip install -r requirements.txt && \
    pip install python-dotenv

COPY . .

CMD ["flask", "run", "--host=0.0.0.0"]
