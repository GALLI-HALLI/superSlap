import styles from "./GameTutorial.module.scss";
import BombTutorial from "../../image/tutorialBombGame1.png";
import LeftRightTutorial from "../../image/tutorialLeftRight.png";
import HunminTutorial from "../../image/tutorialHunmin.png";
import PencilSpinTutorial from "../../image/tutorialPencilSpin.png";

type TGameTutorial = {
  game: string;
};

const GameTutorial = (props: TGameTutorial) => {
  let tutorialImage = BombTutorial;

  switch (props.game) {
    case "bomb":
      tutorialImage = BombTutorial;
      break;
    case "leftright":
      tutorialImage = LeftRightTutorial;
      break;
    case "hunmin":
      tutorialImage = HunminTutorial;
      break;
    case "pencilspin":
      tutorialImage = PencilSpinTutorial;
      break;
  }

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.section}>
          <div className={styles.main}>
            <img src={tutorialImage} alt="bombGameTutorial" width="330px" />
          </div>
          {/* 타이머 추가 예정! */}
        </div>
      </div>
    </>
  );
};

export default GameTutorial;
