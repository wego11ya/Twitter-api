const passport = require("passport");
const helpers = require("../_helpers");

const authenticatedUser = (req, res, next) => {
  // - 使用 jwt 驗證
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(401).json({ status: "error", message: "unauthorized" });
    }
    req.user = user.dataValues;
    // use helpers.getUser(req) to meet the requirement of the test
    if (helpers.getUser(req).role !== "user") {
      return res.status(401).json({ status: "error", message: "unauthorized" });
    }
    next();
  })(req, res, next);
};

const authenticatedAdmin = (req, res, next) => {
  // - 使用 jwt 驗證
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error || !user) {
      return res
        .status(403)
        .json({ status: "error", message: "permisson denied" });
    }
    req.user = user.dataValues;
    // use helpers.getUser(req) to meet the requirement of the test
    if (helpers.getUser(req).role !== "admin") {
      return res
        .status(403)
        .json({ status: "error", message: "permisson denied" });
    }
    next();
  })(req, res, next);
};

module.exports = {
  authenticatedUser,
  authenticatedAdmin,
};
