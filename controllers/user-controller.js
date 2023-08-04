const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUser } = require("../helpers/auth-helper");
const { newError } = require("../helpers/error-helper");
const { User, Tweet, Followship, Like, Reply } = require("../models");
const { de } = require("faker/lib/locales");

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON();
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
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body;
      if (
        !account?.trim() ||
        !name?.trim() ||
        !email?.trim() ||
        !password?.trim() ||
        !checkPassword?.trim()
      )
        throw newError(400, "所有欄位都是必填");
      if (password !== checkPassword)
        throw newError(400, "密碼與確認密碼不相符");
      const [userByEmail, userByAccount] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { account } }),
      ]);
      if (userByEmail) throw newError(400, "email 已被註冊");
      if (userByAccount) throw newError(400, "account 已被註冊");
      const user = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10),
      });
      const newUser = user.toJSON();
      delete newUser.password;
      return res.json(newUser);
    } catch (error) {
      next(error);
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const currentUser = await User.findByPk(getUser(req).id, {
        attributes: { exclude: ["password"] },
        raw: true,
      });

      if (!currentUser) throw newError(404, "使用者不存在");
      return res.json(currentUser);
    } catch (error) {
      next(error);
    }
  },
  getUserInfo: async (req, res, next) => {
    try {
      // Retreive followerCount, followingCount,tweetsCount, isFollowed
      const theUserId = req.params.id;
      const theUser = await User.findByPk(theUserId, {
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
        raw: true,
      });
      if (!theUser || theUser.role !== "user")
        throw newError(404, "使用者不存在");
      const [followerCount, followingCount, tweetsCount, isFollowed] =
        await Promise.all([
          Followship.count({ where: { followingId: theUserId } }),
          Followship.count({ where: { followerId: theUserId } }),
          Tweet.count({ where: { UserId: theUserId } }),
          Followship.findOne({
            where: { followerId: getUser(req).id, followingId: theUserId },
          }),
        ]);
      return res.json({
        ...theUser,
        followerCount,
        followingCount,
        tweetsCount,
        isFollowed: !!isFollowed,
      });
    } catch (error) {
      next(error);
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      // retreive likeCounts, replyCounts, isLiked
      const theUserId = req.params.id;
      const currentUserId = getUser(req).id;
      const theUser = await User.findByPk(theUserId);
      if (!theUser || theUser.role !== "user")
        throw newError(404, "使用者不存在");
      const tweets = await Tweet.findAll({
        where: { UserId: theUserId },
        include: [
          { model: Like, attributes: ["id", "UserId"] },
          { model: Reply, attributes: ["id"] },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (tweets.length === 0) throw newError(404, "使用者沒有推文");
      const tweetsInfo = tweets.map((tweet) => {
        let tweetJSON = tweet.toJSON();
        const isLiked = tweetJSON.Likes.some(
          (like) => like.UserId === currentUserId
        );
        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          likeCounts: tweet.Likes.length,
          replyCounts: tweet.Replies.length,
          isLiked,
        };
      });

      return res.json(tweetsInfo);
    } catch (error) {
      next(error);
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      // retreive replies and replyTo(which user account)

      const theUserId = req.params.id;
      const theUser = await User.findByPk(theUserId);
      if (!theUser || theUser.role !== "user")
        throw newError(404, "使用者不存在");
      const replies = await Reply.findAll({
        where: { UserId: theUserId },
        include: [
          {
            model: Tweet,
            attributes: ["id"],
            include: [{ model: User, attributes: ["account"] }],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      const repliesInfo = replies.map((reply) => {
        const replyJSON = reply.toJSON();
        const replyTo = replyJSON.Tweet.User.account;
        delete replyJSON.Tweet;
        return {
          ...replyJSON,
          replyTo,
        };
      });
      return res.json(repliesInfo);
    } catch (error) {
      next(error);
    }
  },
  getUserLikes: async (req, res, next) => {
    // 推文資料, 每天推文的likeCounts, replyCounts, isLiked
    try {
      const theUserId = req.params.id;
      const currentUserId = getUser(req).id;
      const theUser = await User.findByPk(theUserId);
      if (!theUser || theUser.role !== "user")
        throw newError(404, "使用者不存在");
      const likes = await Like.findAll({
        where: { UserId: theUserId },
        include: [
          {
            model: Tweet,
            include: [
              { model: Like },
              { model: Reply },
              { model: User, attributes: ["id", "account", "name", "avatar"] },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      const likesInfo = likes.map((like) => {
        const likeJSON = like.toJSON();
        const isLiked = likeJSON.Tweet.Likes.some(
          (like) => like.UserId === currentUserId
        );

        return {
          TweetId: likeJSON.Tweet.id,
          user: likeJSON.Tweet.User,
          description: likeJSON.Tweet.description,
          likeCounts: likeJSON.Tweet.Likes.length,
          replyCounts: likeJSON.Tweet.Replies.length,
          isLiked,
          createdAt: likeJSON.Tweet.createdAt,
        };
      });
      res.json(likesInfo);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
