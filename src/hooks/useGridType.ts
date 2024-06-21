import { useRecoilValue } from "recoil";
import { gridTypeAtom } from "../store/atoms";

export const useGridType = () => useRecoilValue(gridTypeAtom);
