const router = require("express").Router();
const RoomManager = require("./roomManager.js");
const { nanoid } = require("nanoid");

const checkAuth = require("../middleware/checkAuth");
const { gameSocket } = require("../app");

const roomManager = new RoomManager();

//방만들기 클릭하면 실행 될 것
router.get("/make", checkAuth.headerToUserId, (req, res) => {
  const id = req.user;
  let code = "";
  do {
    code = nanoid(7);
  } while (roomManager.hasRoom(code));
  roomManager.createRoom(code, id, gameSocket);
  console.log(roomManager);
  res.json({ code }); //code 받아서 그 라우터로 이동(ex localhost:3000/room/code번호)
});

router.post("/enter", (req, res) => {
  const code = req.body.code;
  if (roomManager.hasRoom(code)) {
    if (roomManager.rooms.get(code).players.length > 7) {
      return res.json({
        succuess: false,
        msg: "인원이 8명이상입니다.",
      });
    }
    return res.json({
      succuess: true,
    });
  } else {
    return res.json({
      succuess: false,
      msg: "방이 존재하지 않습니다.",
    });
  }
});

module.exports = {
  router: router,
  roomManager: roomManager,
};
