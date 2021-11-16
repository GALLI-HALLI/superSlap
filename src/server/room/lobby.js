const router = require("express").Router();
const RoomManager = require("./roomManager.js");
const { nanoid } = require("nanoid");

let roomManager = new RoomManager();

router.get("/", (req, res) => {
  //LobbyPage render
});

//방만들기 클릭하면 실행 될 것
router.post("/", (req, res) => {
  const id = req.body.id; //아마 토큰 받아서 토큰을 아이디로 변환해야할 것 같다-> 우선 임시로 id를 받는다

  let code = "";
  do {
    code = nanoid(7);
  } while (!roomManager.createRoom(code, id));

  res.json({
    code,
  }); //code 받아서 그 라우터로 이동(ex localhost:3000/game/code번호)
});

module.exports = router;
