const router = require("express").Router();

const lobby = require("./room/lobby");
router.use("/lobby", lobby);

module.exports = router;
