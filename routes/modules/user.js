const router = require("express").Router();
const userController = require("../../controllers/user-controller");
const upload = require("../../middleware/multer");

router.get("/current_user", userController.getCurrentUser);
router.get("/top_followed", userController.getTopFollowedUsers);
router.get("/:id/tweets", userController.getUserTweets);
router.get("/:id/replied_tweets", userController.getUserReplies);
router.get("/:id/likes", userController.getUserLikes);
router.get("/:id/followings", userController.getUserFollowings);
router.get("/:id/followers", userController.getUserFollowers);
router.put("/:id/setting", userController.putUserSetting);
router.patch("/:id/cover", userController.patchUserCover);
router.get("/:id", userController.getUserInfo);
router.put(
  "/:id",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  userController.putUser
);

module.exports = router;
