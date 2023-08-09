const router = require("express").Router();
const userController = require("../../controllers/user-controller");

router.get("/current_user", userController.getCurrentUser);
router.get("/top_followed", userController.getTopFollowedUsers);
router.get("/:id/tweets", userController.getUserTweets);
router.get("/:id/replied_tweeets", userController.getUserReplies);
router.get("/:id/likes", userController.getUserLikes);
router.get("/:id/followings", userController.getUserFollowings);
router.get("/:id/followers", userController.getUserFollowers);
router.get("/:id", userController.getUserInfo);

module.exports = router;
