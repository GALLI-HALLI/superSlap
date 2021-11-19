import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const initializeStore = () => {
  // 스토어 생성
  const store = configureStore({
    reducer: rootReducer,
    devTools: true,
  });

  return store;
};

export default initializeStore;
