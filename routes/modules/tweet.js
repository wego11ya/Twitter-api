const router = require("express").Router();
const tweetController = require("../../controllers/tweet-controller");

router.get("/", tweetController.getTweets);
router.get("/:tweet_id", tweetController.getTweet);
router.post("/", tweetController.postTweet);

module.exports = router;
