import BigNumber from "bignumber.js";
import { Currency } from "../types/Currencies";

const formatPrice = (
    n?: number | string | BigNumber | null,
    asWei = true,
    curr?: Currency
): string => {
    let digits = 18;
    if (curr === "VEUSD") digits = 6;
    const formattedNumber = n
        ? (n instanceof BigNumber ? n : new BigNumber(n))
              .dividedBy(asWei ? 10 ** digits : 1)
              .toFormat(2, {
                  groupSize: 3,
                  groupSeparator: ".",
                  decimalSeparator: ",",
              })
        : "0";

    if (formattedNumber.endsWith(",00") || !formattedNumber.startsWith("0")) {
        return formattedNumber.slice(0, -3);
    }

    return formattedNumber;
};

export default formatPrice;
