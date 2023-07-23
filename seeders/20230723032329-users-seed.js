"use strict";
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      Array.from({ length: 11 }, (_, index) => {
        return index === 0
          ? {
              account: "root",
              password: bcrypt.hashSync("12345678", 10),
              email: "root@example.com",
              name: "root",
              avatar: faker.image.avatar(),
              cover: faker.image.urlLoremFlickr({ category: "nature" }),
              introduction: "I am administrator",
              role: "admin",
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          : {
              account: `user${index}`,
              password: bcrypt.hashSync("12345678", 10),
              email: `user${index}@example.com`,
              name: `user${index}`,
              avatar: faker.image.avatar(),
              cover: faker.image.urlLoremFlickr({ category: "nature" }),
              introduction: faker.lorem.paragraph(2),
              role: "user",
              createdAt: new Date(),
              updatedAt: new Date(),
            };
      }),
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", {});
  },
};
