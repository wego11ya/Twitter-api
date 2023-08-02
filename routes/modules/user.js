const router = require("express").Router();
const userController = require("../../controllers/user-controller");

router.get("/current_user", userController.getCurrentUser);
router.get("/:id/tweets", userController.getUserTweets);
router.get("/:id", userController.getUserInfo);

module.exports = router;
