import usePriceConversion from "@/hooks/usePriceConversion";
import formatPrice from "@/utils/formatPrice";
import BigNumber from "bignumber.js";

const useConvertPrices = (
    prices?: BigNumber[],
    currency?: "VET" | "WoV" | "vVET" | null,
    asWei: boolean = true
) => {
    const priceConversion = usePriceConversion();
    if (!prices || !currency || !priceConversion) return null;
    return prices.map((price) => {
        const priceToUSD = price.multipliedBy(
            priceConversion[currency === "vVET" ? "VET" : currency]
        );
        const priceToVET = priceToUSD.dividedBy(priceConversion["VET"]);
        const priceToWoV = priceToUSD.dividedBy(priceConversion["WoV"]);

        const rawPrices = {
            VET: priceToVET,
            vVET: priceToVET,
            WoV: priceToWoV,
            USD: priceToUSD,
        };

        const formattedPrices = {
            VET: formatPrice(priceToVET, asWei),
            vVET: formatPrice(priceToVET, asWei),
            WoV: formatPrice(priceToWoV, asWei),
            USD: formatPrice(priceToUSD, asWei),
        };

        return {
            rawPrices,
            formattedPrices,
        };
    });
};

export default useConvertPrices;
