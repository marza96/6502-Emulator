FROM ubuntu:latest
WORKDIR /home/node/SNESEmulator

RUN apt update
RUN apt install htop
RUN apt install nano
RUN apt install curl -y

RUN touch /root/install_nvm.sh
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh > /root/install_nvm.sh
RUN bash /root/install_nvm.sh
RUN rm /root/install_nvm.sh
RUN nvm install 8.0


