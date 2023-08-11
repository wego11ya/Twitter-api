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
  postReply: async (req, res, next) => {
    try {
      const currentUser = getUser(req);
      const tweetId = Number(req.params.tweet_id);
      const comment = req.body.comment.trim();
      const tweet = await Tweet.findOne({ where: { id: tweetId } });

      if (!tweet) throw newError(404, "該貼文不存在");
      if (!comment) throw newError(400, "內容不可空白");
      if (comment.length > 140) throw newError(400, "字數不可超過140字");

      const replyInfo = await Reply.create({
        UserId: currentUser.id,
        TweetId: tweetId,
        comment,
      });
      res.json(replyInfo);
    } catch (error) {
      next(error);
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const tweetId = Number(req.params.tweet_id);
      const tweet = await Tweet.findByPk(tweetId);
      if (!tweet) throw newError(404, "該貼文不存在");
      const repliesInfo = await Reply.findAll({
        where: { TweetId: tweetId },
        attributes: ["id", "comment", "createdAt"],
        include: [
          { model: User, attributes: ["id", "account", "name", "avatar"] },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.json(repliesInfo);
    } catch (error) {
      next(error);
    }
  },
  addLike: async (req, res, next) => {
    try {
      const currentUser = getUser(req);
      const tweetId = Number(req.params.id);
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(tweetId),
        Like.findOne({ where: { UserId: currentUser.id, TweetId: tweetId } }),
      ]);
      if (!tweet) throw newError(404, "該貼文不存在");
      if (like) throw newError(400, "已按過讚");
      const likeInfo = await Like.create({
        UserId: currentUser.id,
        TweetId: tweetId,
      });
      res.json(likeInfo);
    } catch (error) {
      next(error);
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const currentUser = getUser(req);
      const tweetId = Number(req.params.id);
      const unLike = await Like.destroy({
        where: { UserId: currentUser.id, TweetId: tweetId },
      });
      res.json({ deleted: unLike > 0 });
    } catch (error) {
      next(error);
    }
  },
};
module.exports = tweetController;
