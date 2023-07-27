"use strict";

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// 每個使用者追蹤隨機0-10個使用者
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const usersIdArr = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE role = 'user';`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const followships = [];
    let copyUsersIdArr = [...usersIdArr];
    usersIdArr.forEach((userObj) => {
      let ranmdomFollowings = Math.floor(Math.random() * 10);
      shuffle(copyUsersIdArr);
      for (let i = 0; i < ranmdomFollowings; i++) {
        if (userObj.id === copyUsersIdArr[i].id) continue;
        followships.push({
          followerId: userObj.id,
          followingId: copyUsersIdArr[i].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });
    await queryInterface.bulkInsert("Followships", followships);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Followships", null, {});
  },
};
