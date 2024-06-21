import useGraphQL from "@/hooks/useGraphQL";
import useSWR from "swr";
import { TopUserKind } from "../../generated/graphql";
import BasePlaceholder from "../common/BasePlaceholder/BasePlaceholder";
import { Box } from "../common/Box";
import UserCard from "../UserCard";
import HomeSwiper from "./HomeSwiper";

export interface HomeTopUsersProps {
    kind: TopUserKind;
}

function Placeholder() {
    return (
        <Box backgroundColor="highlight" borderRadius={4} overflow="hidden">
            <BasePlaceholder width="100%" height="100%">
                <rect x="0" y="0" width="100%" height="100%" />
            </BasePlaceholder>
        </Box>
    );
}

const HomeTopUsers = ({ kind }: HomeTopUsersProps) => {
    const { sdk } = useGraphQL();
    const { data } = useSWR([{ kind }, "TOP_USER"], (args) =>
        sdk.GetTopUsers(args)
    );

    return (
        <HomeSwiper
            ItemComponent={UserCard}
            PlaceholderComponent={Placeholder}
            items={data?.users}
            title="Top Artists"
            swiperProps={{
                slidesPerView: 2,
                breakpoints: {
                    520: { slidesPerView: 3 },
                    700: { slidesPerView: 4 },
                    992: { slidesPerView: 5 },
                    1280: { slidesPerView: 6 },
                },
            }}
        />
    );
};

export default HomeTopUsers;
