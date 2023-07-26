"use strict";
const repliesPerTweet = 3;
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tweetsIdArr = await queryInterface.sequelize.query(
      `SELECT id FROM Tweets;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const usersIdArr = (
      await queryInterface.sequelize.query(
        `SELECT id FROM Users WHERE role = 'user';`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      )
    ).map((userObj) => userObj.id);

    const replies = [];

    tweetsIdArr.forEach((tweetObj) => {
      replies.push(
        ...Array.from({ length: repliesPerTweet }, () => {
          return {
            UserId: usersIdArr[Math.floor(Math.random() * usersIdArr.length)],
            TweetId: tweetObj.id,
            comment: faker.lorem.sentence(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        })
      );
    });

    await queryInterface.bulkInsert("Replies", replies);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Replies", null, {});
  },
};
