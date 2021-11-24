const sendMetaData = (gameSocket, room, code) => {
  gameSocket.in(code).emit("metadata", {
    id: room.id,
    code: room.code,
    players: Array.from(room.players.entries()).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          id: key,
          nickname: value.nickname,
        },
      }),
      {},
    ),
    type: room.type,
    gameStatus: room.gameStatus,
    startTime: room.startTime,
  });
};

module.exports = {
  sendMetaData,
};
