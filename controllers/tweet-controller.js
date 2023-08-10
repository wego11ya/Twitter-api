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

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const currentUser = getUser(req);
      const tweets = await Tweet.findAll({
        attributes: [
          "id",
          "description",
          "createdAt",
          [
            sequelize.literal(
              `(SELECT COUNT(id) FROM Replies WHERE TweetId = Tweet.id)`
            ),
            "replyCounts",
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(id) FROM Likes WHERE TweetId = Tweet.id
          )`),
            "likeCounts",
          ],
          [
            sequelize.literal(
              `(SELECT EXISTS(SELECT(id) FROM Likes WHERE TweetId = Tweet.id AND UserId = ${currentUser.id}))`
            ),
            "isLiked",
          ],
        ],
        include: [
          { model: User, attributes: ["id", "account", "name", "avatar"] },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.json(tweets);
    } catch (error) {
      next(error);
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const currentUser = getUser(req);
      const tweetId = Number(req.params.tweet_id);
      const tweet = await Tweet.findOne({
        where: { id: tweetId },
        attributes: [
          "id",
          "description",
          "createdAt",
          [
            sequelize.literal(`(
            SELECT COUNT(id) FROM Replies WHERE TweetId = Tweet.id
          )`),
            "replyCounts",
          ],
          [
            sequelize.literal(`(
            SELECT COUNT(id) FROM Likes WHERE TweetId = Tweet.id
          )`),
            "likeCounts",
          ],
          [
            sequelize.literal(`(
              SELECT EXISTS(SELECT(id) FROM Likes WHERE TweetId = Tweet.id AND UserId = ${currentUser.id})
            )`),
            "isLiked",
          ],
        ],
        include: [
          { model: User, attributes: ["id", "account", "name", "avatar"] },
        ],
      });
      if (!tweet) throw newError(404, "該貼文不存在");
      res.json(tweet);
    } catch (error) {
      next(error);
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const currentUser = getUser(req);
      const description = req.body.description.trim();
      if (!description) throw newError(400, "內容不可空白");
      if (description.length > 140) throw newError(400, "字數不可超過140字");
      const tweetInfo = await Tweet.create({
        UserId: currentUser.id,
        description,
      });
      res.json(tweetInfo);
    } catch (error) {
      next(error);
    }
  },
};
module.exports = tweetController;
