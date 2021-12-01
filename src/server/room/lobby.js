const RoomManager = require("./roomManager.js");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

const checkAuth = require("../middleware/checkAuth");

const roomManager = new RoomManager();

const createLobbyRoute = (gameSocket) => {
  const router = require("express").Router();
  //방만들기 클릭하면 실행 될 것
  router.get("/make", checkAuth.headerToUserId, (req, res) => {
    const id = req.user;
    let code = "";
    do {
      code = nanoid();
    } while (roomManager.hasRoom(code));
    roomManager.createRoom(code, id, gameSocket);
    res.json({ code }); //code 받아서 그 라우터로 이동(ex localhost:3000/room/code번호)
  });

  router.post("/enter", (req, res) => {
    const code = req.body.roomId;
    console.log(req.body);
    if (roomManager.hasRoom(code)) {
      if (roomManager.rooms.get(code).players.size > 7) {
        return res.json({
          succuess: false,
          msg: "방이 꽉찼습니다.",
        });
      }
      return res.json({
        succuess: true,
        msg: "방에 입장합니다.",
      });
    } else {
      return res.json({
        succuess: false,
        msg: "방이 존재하지 않습니다.",
      });
    }
  });

  return router;
};

module.exports = {
  createLobbyRoute,
  roomManager: roomManager,
};
