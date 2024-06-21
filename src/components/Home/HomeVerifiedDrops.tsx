import { CardPlaceholder } from "@/components/cards/CardPlaceholder";
import useGraphQL from "@/hooks/useGraphQL";
import useSWR from "swr";
import DropCard from "../DropCard";
import HomeSwiper from "./HomeSwiper";

export default function HomeVerifiedDrops() {
    const { sdk } = useGraphQL();
    const { data } = useSWR("VERIFIED_DROPS", () => sdk.GetVerifiedDrops());

    return (
        <HomeSwiper
            ItemComponent={DropCard}
            PlaceholderComponent={CardPlaceholder}
            items={data?.drops}
            title="Verified Drops"
            swiperProps={{
                slidesPerView: 1,
                breakpoints: {
                    576: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1200: { slidesPerView: 4 },
                    1400: { slidesPerView: 5 },
                },
            }}
        />
    );
}
