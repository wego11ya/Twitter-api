const jwt = require("jsonwebtoken");
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
};

module.exports = userController;
