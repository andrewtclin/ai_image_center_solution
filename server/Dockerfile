# docker image: registry.gitlab.com/smasoft-ai-team/application/imgfa/imgfa-be:base
# FROM ubuntu:18.04
# WORKDIR /app1
# ADD . .
# RUN apt-get update && apt-get install -y \ 
# python3-pip \ 
# nano

# ADD pip_requirements.txt .
# RUN pip3 install -r pip_requirements.txt

FROM registry.gitlab.com/smasoft-ai-team/application/imgfa/imgfa-be:base
RUN ["rm", "-rf", "/app1/auto_build/temp", "/app1/auto_build/module_dist", "/app", "/app1"]
WORKDIR /app1
ADD . .
RUN python3 ./auto_build/build_all.py
# RUN ["chmod", "+x", "./build_cython.sh"]
# RUN ["sh", "./build_cython.sh"]
RUN ["cp", "-r", "/app1/auto_build/module_dist/app1", "/app"]
ENV PYTHONUNBUFFERED=0

WORKDIR /app
CMD python3 app.py
