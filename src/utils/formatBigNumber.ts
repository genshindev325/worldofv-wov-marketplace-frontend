import BigNumber from "bignumber.js";

/**
 * Format the number as a numeric string stripping the decimal component.
 */
export default function formatBigNumber(n: BigNumber) {
    return n.toFormat(0, BigNumber.ROUND_DOWN, { groupSeparator: "" });
}
