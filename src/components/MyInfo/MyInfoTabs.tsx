import React, { useCallback, useState } from "react";
import "../../pages/MyInfo.scss";
import FirstTab from "./FirstTab";
import SecondTab from "./SecondTab";
import ThirdTab from "./ThirdTab";
import cn from "classnames";

// 탭 이름들 가제
const Menus = ["통계", "캐릭터", "칭호"];

const MyInfoTabs = () => {
  // 어떤 탭이 처음에 보여질지.
  const [activeTab, setActiveTab] = useState(Menus[0]);

  const WhichTabComponent = () => {
    if (activeTab === Menus[0]) {
      return <FirstTab />;
    }
    if (activeTab === Menus[1]) {
      return <SecondTab />;
    }
    if (activeTab === Menus[2]) {
      return <ThirdTab />;
    }
  };

  //  Functions to handle Tab Switching
  const handleTab = useCallback((TabName: string) => {
    setActiveTab(TabName);
  }, []);

  return (
    <div className="myInfoTabs">
      <nav className="tabNav">
        {Menus.map((menu) => (
          <button
            key={menu}
            className={cn({ active: activeTab === menu })}
            onClick={() => handleTab(menu)}
          >
            {menu}
          </button>
        ))}
      </nav>
      <div className="TabOutlet">{WhichTabComponent()}</div>
    </div>
  );
};

export default MyInfoTabs;
