const sendMetaData = (gameSocket, room, code, rank) => {
  const loser = room.players.get(room.loserId);
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
      {}
    ),
    type: room.type,
    gameStatus: room.gameStatus,
    startTime: room.startTime,
    loser: loser ? { id: room.loserId, nickname: loser.nickname } : undefined,
    rank: rank,
  });
};

module.exports = {
  sendMetaData,
};
