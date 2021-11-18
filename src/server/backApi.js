const router = require("express").Router();

const auth = require("./routes/auth");
const post = require("./routes/post");
const lobby = require("./room/lobby");

router.use("/auth", auth);
router.use("/post", post);
router.use("/lobby", lobby.router);

module.exports = router;
