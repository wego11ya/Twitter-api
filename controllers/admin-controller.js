const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUser } = require("../helpers/auth-helper");
const { newError } = require("../helpers/error-helper");
const {
  User,
  Tweet,
  Followship,
  Like,
  Reply,
  sequelize,
} = require("../models");

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON();
      if (userData.role !== "admin") throw newError(403, "permission denied");
      delete userData.password;
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      res.json({
        status: "success",
        token,
        user: userData,
      });
    } catch (error) {
      next(error);
    }
  },
  getUsers: async (req, res, next) => {
    try {
      /*
      tweetsCount
      likesCount (指使用者的 tweets 所獲得 like 的累積總量)
      followerCount
      followingCount
      使用者清單預設按推文數排序，由多至少
      */
      const users = await User.findAll({
        where: { role: "user" },
        attributes: {
          exclude: ["password"],
          include: [
            [
              sequelize.literal(
                `(SELECT COUNT(id) FROM Tweets WHERE UserId = User.id)`
              ),
              "tweetsCount",
            ],
            [
              sequelize.literal(
                `(SELECT COUNT(id) FROM Likes WHERE TweetId IN (SELECT id FROM Tweets WHERE UserId = User.id))`
              ),
              "likesCount",
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(id) FROM Followships WHERE followingId = User.id
              )`),
              "followerCount",
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(id) FROM Followships WHERE followerId = User.id
              )`),
              "followingCount",
            ],
          ],
        },
        order: [[sequelize.literal("tweetsCount"), "DESC"]],
      });
      res.json(users);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
