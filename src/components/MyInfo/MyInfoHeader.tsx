import React from "react";
import "../../pages/MyInfo.scss";
import MyInfoHeaderDisplay from "./MyInfoHeaderDisplay";

const MyInfoHeader = () => {
  return (
    <div className="MyInfoHeader">
      <div className="Top">
        <button className="GoBackButton">뒤로가기</button>
        <div className="MyInfoTitle"> 내 정보 </div>
      </div>
      <MyInfoHeaderDisplay />
    </div>
  );
};

export default MyInfoHeader;