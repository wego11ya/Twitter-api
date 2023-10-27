# Twitter API

This repository is part of the Simple Twitter project, which has been developed using a front-end and back-end separation model. The focus here is on the back-end API.

### Why This Project?

This project aims to provide a simplified yet robust Twitter-like social networking service. It demonstrates how to build scalable and maintainable APIs using Node.js, MySQL, and Sequelize.

# AWS Deployment [🚀 Try it on AWS!](http://twitter-api-awseb-dev.ap-northeast-1.elasticbeanstalk.com/)

This project is deployed on AWS to demonstrate my capability in utilizing AWS services, specifically AWS Elastic Beanstalk for application hosting and AWS RDS for database management.
You can [try the deployed version here](http://twitter-api-awseb-dev.ap-northeast-1.elasticbeanstalk.com/). You may also follow this [API document](https://wei-lin-vision.notion.site/Twitter-API-bbe054fbca0148d59814db94e728d23d) for more details on how to interact with the API using Postman.

# API Documentation

https://wei-lin-vision.notion.site/Twitter-API-bbe054fbca0148d59814db94e728d23d

# Product Features

### Administrator

- View all tweets from users
- Delete any tweet
- View all user information

### Users

- Register a new account and login to the website
- Post tweets and view all tweets
- Reply to other tweets
- Like / unlike other tweets
- Follow / unfollow other Users
- Edit personal information including account, name, email, password, self-introduction, avatar etc.
- View all tweets, replies, liked tweets, as well as the follower and following lists of the user on personal page
- View the top ten recommended users to follow

# Install Locally

1. Install Node.js, npm, nodemon, MySQL
2. Clone this project to your local repository
3. Change directory to project folder
4. Install npm packages `npm install`
5. Create a .env file based on the instruction of .env.example
6. Set your own MySQL setting in config/config.js

   ```js
   development: {
       username: "<user name>",
       password: "<user password>",
       database: "<database name>",
       host: "127.0.0.1",
       dialect: "mysql"
     }
   ```

7. Run migration files and load seed data

   ```
   npx sequelize db:migrate
   npx sequelize db:seed:all
   ```

8. Run project `npm run dev`
9. You will see this message when the project has been successfully executed

   ```
   Example app listening on port 3000!
   ```

# Test Account

### **Administrator**

account : root

password: 12345678

### **User**

account : user1

password: 12345678

# Developer

### [Wei Lin](https://github.com/wego11ya)
