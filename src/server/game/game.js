/**
 * 게임 전체에 대해서 상속받아서 구현해야하는 추상 클래스
 * 각 추상 메서드들을 상속받아서 구현해야합니다.
 */
class Game {
  constructor(room) {
    this.room = room;
  }

  /**
   * 사용자 한명에 대한 소켓이벤트 초기화 & 게임 초기 세팅
   * @param {Socket} socket 사용자 한명에 대한 소켓 정보
   */
  initializeSocketEvents(socket) {
    throw new Error("Not implemented");
  }

  /**
   * 게임 시작
   */
  start() {
    throw new Error("Not implemented");
  }

  /**
   * 사용자 한명이 나갔을 경우
   * @param {Socket} socket 사용자 한명에 대한 소켓 정보
   */
  disconnect(socket) {
    throw new Error("Not implemented");
  }

  /**
   * 게임 내부에서 게임을 끝냈다고 외부로 이벤트를 보내주기 위함
   * 게임이 끝났을때 상속받은 클래스에서 반드시 호출해야합니다.
   */
  endRoom() {
    this.room.endGame();
  }

  /**
   * 현재 게임이 진행되는 방의 소켓 인스턴스를 반환합니다.
   */
  getRoomSocket() {
    return this.room.getRoomSocket();
  }
}

module.exports = Game;
