import {
  useSelector as useSelectorFn,
  TypedUseSelectorHook,
} from "react-redux";
import { RootState } from "../store/rootReducer";

export const useSelector = useSelectorFn as TypedUseSelectorHook<RootState>;
