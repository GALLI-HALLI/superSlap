const router = require("express").Router();
const RoomManager = require("./roomManager.js");
const asyncHandler = require("express-async-handler");
const { nanoid } = require("nanoid");

const checkAuth = require("../middleware/checkAuth");

const roomManager = new RoomManager();

//방만들기 클릭하면 실행 될 것
router.get("/make", checkAuth.headerToUserId, (req, res) => {
  const id = req.user;
  let code = "";
  do {
    code = nanoid(7);
  } while (roomManager.hasRoom(code));

  roomManager.createRoom(code, id);

  res.json({
    code,
  }); //code 받아서 그 라우터로 이동(ex localhost:3000/game/code번호)
});

router.post("/enter", (req, res) => {
  const code = req.body.code;
  if (roomManager.hasRoom(code)) {
    return res.json({
      succuess: true,
    });
  } else {
    return res.json({
      succuess: false,
    });
  }
});

module.exports = {
  router: router,
  roomManager: roomManager,
};
