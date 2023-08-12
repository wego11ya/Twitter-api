const router = require("express").Router();
const passport = require("../config/passport");
const admin = require("./modules/admin");
const user = require("./modules/user");
const tweet = require("./modules/tweet");
const followship = require("./modules/followship");
const adminController = require("../controllers/admin-controller");
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
// 後台登入
router.post(
  "/api/admin/signIn",
  passport.authenticate("local", { session: false }),
  adminController.signIn
);
// user功能
router.use("/api/users", authenticatedUser, user);
// tweet功能
router.use("/api/tweets", authenticatedUser, tweet);
// followship功能
router.use("/api/followships", authenticatedUser, followship);
module.exports = router;
