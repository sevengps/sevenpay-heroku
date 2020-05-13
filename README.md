# SEVENPAY PAYMENT- HOSTED PAYMENT

Welcome to SevenPay payment - Hosted Payment

# Requirements

To be able to run this application locally, please make sure you have the following installed

1. Nodejs >= v6
2. MongoDB >= v3
3. Angular CLI >= v7

# Running the frontEnd of the application

After clonning the Project

1. Navigate into the project directory

cd payments-web

2. Install all required dependencies

npm install

3. Run the app locally using its default port 4200

ng serve

4. Run the app using a different port number (Repalce portNumber with your custom port number)

ng serve --port *portNumber*

# Running the Express Server


1. Navigate into the Server directory

cd Server

2. Install all required dependencies

npm install

3. Navigate into the src directory

cd src

4. Start the server on port 5000

node app.js

# Deployment

This application is currently deployed on gitlab pages and on github pages. The backend API is deployed on heroku.
 Below instructions show us how to deploy the frontend on gitlab and git hub pages .

## deployment on gitlab pages

1. In your local project directory, create a ".gitlab-ci.yml" file and add configuration similar to this

image: node:8.12.0  
pages:  
     cache:  
     paths:  
    - node_modules/  
  script:  
    - npm install -g @angular/cli@7.1.2  
    - npm install  
    - npm run buildProd  
  artifacts:  
       paths:  
      - public  
  only:  
    - master  
    - pages  
*The configuration above instructs gitlab on the dependencies to use to build your project and where to keep the build files (public)*  

2. Now push your code to your remote repo(project on gitlab)  
3. Once in current working project in gitlab;  
* Click on settings
* Select (click) on the pages option. At this point, gitlab will find your config file then build and deploy your app to a default domain.
* Customize your domain or use gitlab default
