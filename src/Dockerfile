FROM python:3.7.3-slim-stretch

ENV LANG=C.UTF-8
RUN apt-get -y update && apt-get -y install gcc
RUN mkdir /gpt-2
WORKDIR /
COPY . /
#COPY requirements.txt /
RUN pip3 install -r requirements.txt
#WORKDIR /gpt-2
#ADD . /gpt-2

#RUN python3 download_model.py 124M
#RUN python3 download_model.py 355M
#RUN python3 download_model.py 774M
#RUN python3 download_model.py 1558M
#COPY checkpoint /checkpoint
# Make changes to the requirements/app here.
# This Dockerfile order allows Docker to cache the checkpoint layer
# and improve build times if making changes.
RUN pip3 --no-cache-dir install tensorflow==1.15.2 gpt-2-simple starlette uvicorn ujson pyttsx3 times SpeechRecognition
#COPY app.py /
#COPY src /

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENTRYPOINT ["python3", "-X", "utf8", "app.py"]
