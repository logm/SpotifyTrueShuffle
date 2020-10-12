FROM python:latest

WORKDIR /code
ADD . /code

# RUN pip install -r requirements.txt

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

EXPOSE 3000

RUN apt-get update && apt-get install
