const router = require("express").Router();
router.get("/", (req, res) => res.send("Hello World"));
const passport = require("../config/passport");
const user = require("./modules/user");
const userController = require("../controllers/user-controller");
router.post(
  "/api/users/signIn",
  passport.authenticate("local", { session: false }),
  userController.signIn
);
module.exports = router;
