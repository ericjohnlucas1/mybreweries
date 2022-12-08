FROM ubuntu:20.04

COPY . /app
WORKDIR /app

RUN apt -y update && apt install -y python3 && apt -y install python3-pip
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
RUN echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list
RUN apt -y update
RUN apt install -y mongodb-org-shell && apt install -y mongo-tools
RUN pip3 install -r requirements.txt
EXPOSE 5000
CMD ["python3","/app/server.py","||","True"]
