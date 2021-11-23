const createBackApi = (io) => {
  const router = require("express").Router();
  const auth = require("./routes/auth");
  const userInfo = require("./routes/userInfo");
  const { createLobbyRoute } = require("./room/lobby");

  router.use("/auth", auth);
  router.use("/lobby", createLobbyRoute(io));
  router.use("/user-info", userInfo);

  return router;
};

module.exports = createBackApi;
