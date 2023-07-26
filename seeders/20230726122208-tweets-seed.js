"use strict";
const { faker } = require("@faker-js/faker");
const tweetsPerUser = 10;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const usersIdArr = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE role = 'user';`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    let tweets = [];
    usersIdArr.forEach((userIdObj) => {
      tweets.push(
        ...Array.from({ length: tweetsPerUser }, () => {
          return {
            UserId: userIdObj.id,
            description: faker.lorem.paragraph(2),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        })
      );
    });

    await queryInterface.bulkInsert("Tweets", tweets);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tweets", null, {});
  },
};
