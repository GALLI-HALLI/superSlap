const router = require("express").Router();

const auth = require("./routes/auth");
const lobby = require("./room/lobby");

router.use("/auth", auth);
router.use("/lobby", lobby.router);

module.exports = router;
