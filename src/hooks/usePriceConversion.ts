import useGraphQL from "@/hooks/useGraphQL";
import { useMemo } from "react";
import useSWR from "swr";

export default function usePriceConversion() {
    const { sdk } = useGraphQL();

    const { data } = useSWR("LATEST_CONVERSION_RATES", () =>
        sdk.GetLatestConversionRates()
    );

    return useMemo(
        () =>
            data?.rates?.reduce(
                (rates, r) => ({ ...rates, [r.currency]: r.priceUSD }),
                {} as { VET: number; WoV: number }
            ),
        [data]
    );
}
