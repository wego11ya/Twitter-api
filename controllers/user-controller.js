const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { newError } = require("../helpers/error-helper");
const { User } = require("../models");
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
};

module.exports = userController;
