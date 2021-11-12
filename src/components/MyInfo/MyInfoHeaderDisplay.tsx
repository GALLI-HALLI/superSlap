import React from "react";
import "../../pages/MyInfo.scss";

const MyInfoHeaderDisplay = () => {
  return (
    <div className="MyInfoHeaderDisplay">
      <div>이름이랑 아이콘, 칭호 들어갈 곳</div>
      <button className="LogoutButton">로그아웃</button>
    </div>
  );
};

export default MyInfoHeaderDisplay;