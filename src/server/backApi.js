const router = require("express").Router();

const auth = require("./routes/auth");
const lobby = require("./room/lobby");
const userInfo = require("./routes/userInfo");

router.use("/auth", auth);
router.use("/lobby", lobby.router);
router.use("/user-info", userInfo);

module.exports = router;
