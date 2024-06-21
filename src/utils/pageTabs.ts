import { useGridType } from "@/hooks/useGridType";
import { useMediaQuery } from "@react-hook/media-query";
import { useTheme } from "styled-components";
import { NavItemProps } from "../components/PillsNav";

const PAGE_SIZE_SMALL = 24; // small card/grid
const PAGE_SIZE_LARGE = 25; // large card/grid

/**
 * Calculate the number of items to be displayed on the screen so
 * that the Grid component gets fully filled for all grid types.
 */
export function usePageSize() {
    const theme = useTheme();
    const gridType = useGridType();
    const isBigScreen = useMediaQuery(`(min-width: ${theme.breakpoints.z})`);

    return isBigScreen && gridType === "large"
        ? PAGE_SIZE_LARGE
        : PAGE_SIZE_SMALL;
}

export function filterByItemType(
    data: { [key: string]: any },
    itemType: string
) {
    return data[itemType];
}

export function addTabsCount(
    data: { [key: string]: { total?: number | string | null } },
    tabs: NavItemProps[]
) {
    return tabs.map((tab) => ({
        ...tab,
        count: data?.[tab.value]?.total ?? null,
    }));
}
