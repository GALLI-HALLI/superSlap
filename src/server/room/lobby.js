const router = require("express").Router();
const RoomManager = require("./roomManager.js");
const { nanoid } = require("nanoid");

const checkAuth = require("../middleware/checkAuth");

const roomManager = new RoomManager();

//방만들기 클릭하면 실행 될 것
router.post("/make", (req, res) => {
  // const token = localStorage.getItem('x-auth-token');
  const token = req.header("x-auth-token");
  const id = checkAuth.tokenToUser(token).id;
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
  const code = req.body.code; //아마 토큰 받아서 토큰을 아이디로 변환해야할 것 같다-> 우선 임시로 id를 받는다

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
