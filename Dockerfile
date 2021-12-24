FROM ubuntu:latest
WORKDIR /home/node/SNESEmulator

ENTRYPOINT ["/bin/bash"]

RUN apt update
RUN apt install htop
RUN apt install nano
RUN apt install curl -y
RUN apt install git -y

RUN touch /root/install_nvm.sh
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh > /root/install_nvm.sh
RUN bash /root/install_nvm.sh
RUN rm /root/install_nvm.sh
RUN ["/bin/bash", "-c", "-i", "nvm install 12.0"] 
