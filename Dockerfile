FROM node:8.9.1
RUN npm install pm2 -g
RUN useradd --user-group --create-home --shell /bin/false app

# Where the app lives inside of the container file system
ENV HOME=/home/app
COPY package.json $HOME
RUN chown -R app:app $HOME/*

# Set user and install npm packages
USER app
WORKDIR $HOME
RUN npm install

# Set non-root permissions
USER root
COPY . $HOME
RUN chown -R app:app $HOME/*
USER app

# Run the node.js app
CMD ["pm2-docker", "app.js"]
