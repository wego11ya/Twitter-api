const router = require("express").Router();
const tweetController = require("../../controllers/tweet-controller");

router.post("/:tweet_id/replies", tweetController.postReply);
router.get("/:tweet_id/replies", tweetController.getReplies);
router.post("/:id/like", tweetController.addLike);
router.post("/:id/unlike", tweetController.removeLike);
router.get("/:tweet_id", tweetController.getTweet);
router.get("/", tweetController.getTweets);
router.post("/", tweetController.postTweet);

module.exports = router;
