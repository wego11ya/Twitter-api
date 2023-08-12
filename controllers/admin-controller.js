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
};

module.exports = adminController;
