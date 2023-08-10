const router = require("express").Router();
const passport = require("../config/passport");
const user = require("./modules/user");
const tweet = require("./modules/tweet");
const userController = require("../controllers/user-controller");
const { authenticatedUser, authenticatedAdmin } = require("../middleware/auth");

// 前台註冊
router.post("/api/users", userController.signUp);
// 前台登入
router.post(
  "/api/users/signIn",
  passport.authenticate("local", { session: false }),
  userController.signIn
);
// user功能
router.use("/api/users", authenticatedUser, user);
// tweet功能
router.use("/api/tweets", authenticatedUser, tweet);

module.exports = router;
