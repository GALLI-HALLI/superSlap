import React from "react";
import "./MyInfo.scss";
import MyInfoHeader from "../components/MyInfo/MyInfoHeader";
import MyInfoTabs from "../components/MyInfo/MyInfoTabs";

const MyInfo = () => {
  return (
    <div className="myInfo">
      <MyInfoHeader />
      <MyInfoTabs />
    </div>
  );
};

export default MyInfo;