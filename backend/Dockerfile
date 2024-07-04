FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install python-dotenv

COPY . .

CMD ["flask", "run", "--host=0.0.0.0"]
