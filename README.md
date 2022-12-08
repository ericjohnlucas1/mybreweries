# My breweries project

This project is a web application for keeping track of your favorite breweries! This app uses data from https://www.openbrewerydb.org/

## Local Deployment

1) Use the docker-compose.yml file to deploy a mongoDB replica set: `docker-compose up -d`
2) Build the API docker container by running `docker build -t breweryapi .` from the `api/` directory
3) Run the API container, specifying the same overlay network as the mongo replica set created above
    i.e.: `docker run -p 5000:5000 --network mybreweries_brewery --name breweriesapi -d -v /Users/ericjohndsouza/Code/mybreweries/api/:/app breweryapi`
4) Make sure the mongo DB cluster is initialized as a replica set. There is a script `/app/ignition.sh` in the api container to facilite this
5) Start the React UI. Using `npm`, run `npm install` from the `ui/` directory to install the dependancies and `npm start` to start the frontend web service


