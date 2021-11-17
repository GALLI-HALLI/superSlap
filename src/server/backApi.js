const router = require("express").Router();

const lobby = require("./room/lobby");
router.use("/lobby", lobby.router);

module.exports = router;
