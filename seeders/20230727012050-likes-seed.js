"use strict";
const likesPerUser = 10;
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const usersIdArr = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE role = 'user';`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const tweetsIdArr = await queryInterface.sequelize.query(
      `SELECT id FROM Tweets;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const likes = [];
    usersIdArr.forEach((userObj) => {
      shuffle(tweetsIdArr);
      for (let i = 0; i < likesPerUser; i++) {
        likes.push({
          UserId: userObj.id,
          TweetId: tweetsIdArr[i].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });
    await queryInterface.bulkInsert("Likes", likes);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Likes", null, {});
  },
};
