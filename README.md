# Twitter API Introduction

This repository contains the backend API for a Twitter-like project, demonstrating a simple implementation of Twitter's core features. The project is developed with a separation of frontend and backend, where this repository focuses solely on the backend API functionalities.

# API Documentation

https://wei-lin-vision.notion.site/Twitter-API-bbe054fbca0148d59814db94e728d23d

# Entity Relationship Diagram (ERD)

![Twitter_ERD](/public/Twitter-ERD.png)

# System Architecture

![System Architecture](/public/Twitter-API-System-Architecture.png)

# Product Features

### Administrator

- View all tweets from users
- Delete any tweet
- View all user information

### Users

- Register a new account and login to the website
- Post tweets and view all tweets
  ![Tweet Demo](/public/tweet-demo.gif)
- Reply to other tweets
  ![Reply](/public/reply-demo.gif)
- Like / unlike other tweets, Follow / unfollow other Users
  ![Like and Follow](/public/like-unlike-follow-unfollow.gif)
- Edit personal information including account, name, email, password, self-introduction, avatar etc.
  ![Edit](/public/edit-user-info-demo.gif)
- View all tweets, replies, liked tweets, as well as the follower and following lists of the user on personal page
  ![Personal](/public/personal-page.gif)
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
