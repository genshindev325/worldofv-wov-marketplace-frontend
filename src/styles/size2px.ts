import { isNumber } from "lodash";
import { space } from "./theme";

/**
 * In case size is 0 to space.length - 1, then return
 * the amount of pixels indicated in the space[size]
 * coordinate. Otherwise, return the size value as the
 * amount of pixels.
 * @param size integer numer
 * @returns pixels
 */
export function size2px(size: number) {
    return space[size] || size; // TODO: return 'px'
}

export function getSize(size: number | string) {
    return isNumber(size) ? `${size2px(size)}px` : size;
}
