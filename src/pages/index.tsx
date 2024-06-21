import type { NextPage } from "next";
import { Box } from "../components/common/Box";
import { Flex } from "../components/common/Flex";
import Head from "../components/Head";
import HomeCollections from "../components/Home/HomeCollections";
import HomeEndingSoonAuctions from "../components/Home/HomeEndingSoonAuctions";
import HomeFooter from "../components/Home/HomeFooter";
import HomeHero from "../components/Home/HomeHero";
import HomeTopUsers from "../components/Home/HomeTopUsers";
import HomeVerifiedDrops from "../components/Home/HomeVerifiedDrops";
import { TopUserKind } from "../generated/graphql";

const Home: NextPage = () => (
    <Box>
        <Flex
            flexDirection="column"
            columnGap={6}
            marginX={{ _: 4, m: 5, d: 6 }}
        >
            <Head title="Home" />
            <HomeHero />
            {/* <HomeTopBuyers /> */}
            <HomeTopUsers kind={TopUserKind.TopArtist} />
            {/* <HomeTrendingCollections /> */}
            <HomeVerifiedDrops />
            <HomeEndingSoonAuctions />
            <HomeCollections />
        </Flex>
        <HomeFooter />
    </Box>
);

export default Home;
