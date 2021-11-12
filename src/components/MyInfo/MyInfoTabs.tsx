import React, { useCallback, useState } from "react";
import "../../pages/MyInfo.scss";
import FirstTab from "./FirstTab";
import SecondTab from "./SecondTab";
import ThirdTab from "./ThirdTab";

const MyInfoTabs = () => {

  // 탭 이름들
  const TabOneName: string = "통계";
  const TabTwoName: string = "캐릭터 선택";
  const TabThreeName: string = "칭호";

  // 어떤 탭이 보여질지.
  const [activeTab, setActiveTab] = useState(TabOneName);

  // useCallback 하면 작동안함.
  const WhichTabComponent = () => {
    if (activeTab === TabOneName) {
      return <FirstTab />
    }
    if (activeTab === TabTwoName) {
      return <SecondTab /> 
    }
    if (activeTab === TabThreeName) {
      return <ThirdTab />
    }
  }

  //  Functions to handle Tab Switching
  const handleTab = useCallback( (TabName: string) => {
    setActiveTab(TabName);
  }, []);


  return (
    <div className="MyInfoTabs">
      <ul className="TabNav">
        <li 
          className={activeTab === TabOneName ? "active" : ""}
          onClick={() => handleTab(TabOneName)}
        >{TabOneName}</li>
        <li 
          className={activeTab === TabTwoName ? "active" : ""}
          onClick={() => handleTab(TabTwoName)}
        >{TabTwoName}</li>
        <li 
          className={activeTab === TabThreeName ? "active" : ""}
          onClick={() => handleTab(TabThreeName)}
        >{TabThreeName}</li>
      </ul>
      <div className="TabOutlet">
        {WhichTabComponent()}
      </div>
    </div>
  );
};

export default MyInfoTabs;