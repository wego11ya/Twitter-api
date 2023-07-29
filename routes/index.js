const router = require("express").Router();
const passport = require("../config/passport");
const user = require("./modules/user");
const userController = require("../controllers/user-controller");
const { authenticatedUser, authenticatedAdmin } = require("../middleware/auth");

// 前台註冊
router.post("/api/users/signUp", userController.signUp);
// 前台登入
router.post(
  "/api/users/signIn",
  passport.authenticate("local", { session: false }),
  userController.signIn
);

// user功能
router.use("/api/users", authenticatedUser, user);

module.exports = router;
