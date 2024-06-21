import { useRecoilState } from "recoil";
import { gridTypeAtom } from "../../../store/atoms";
import CircleButton from "../../CircleButton";
import Icon from "../../Icon";
import { Flex } from "../Flex";
import { Spacer } from "../Spacer";

export function GridTypeSelector() {
    const [gridType, setGridType] = useRecoilState(gridTypeAtom);

    return (
        <Flex alignItems="center" justifyContent="flex-end">
            <CircleButton
                small
                outline={gridType === "small"}
                onClick={setGridType ? () => setGridType("large") : undefined}
            >
                <Icon icon="grid" />
            </CircleButton>
            <Spacer size={2} />
            <CircleButton
                small
                outline={gridType === "large"}
                onClick={setGridType ? () => setGridType("small") : undefined}
            >
                <Icon icon="grid-large" />
            </CircleButton>
        </Flex>
    );
}
