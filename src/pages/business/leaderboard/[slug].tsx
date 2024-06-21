import { BusinessLeaderboard as Leaderboard } from "@/components/business/BusinessLeaderboard";
import { Box } from "@/components/common/Box";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import Head from "@/components/Head";
import common from "@/styles/_common";
import mixins from "@/styles/_mixins";
import { NextPage, NextPageContext } from "next";
import styled from "styled-components";

const { dark } = mixins;
const { containerFluid } = common;

type BusinessLeaderboardPageProps = {
    pointsContractAddress: string;
    logoUrlLight: string;
    logoUrlDark: string;
    bannerUrlMobile: string;
    bannerUrlDesktop: string;
    leaderboardTab?: "overall" | "monthly";
};

const BusinessLeaderboard: NextPage<BusinessLeaderboardPageProps> = ({
    pointsContractAddress,
    logoUrlLight,
    logoUrlDark,
    bannerUrlMobile,
    bannerUrlDesktop,
    leaderboardTab = "monthly",
}) => {
    const withLogo = logoUrlLight != null && logoUrlDark != null;

    return (
        <>
            <Head title="LeaderBoard" />

            <Container>
                <Flex flexDirection="column" columnGap={5} mt={6}>
                    <Flex
                        justifyContent="center"
                        rowGap={{ _: 0, a: 6 }}
                        alignItems="center"
                        flexDirection={{ _: "column", a: "row" }}
                    >
                        {withLogo && (
                            <BusinessLogo
                                imgLight={logoUrlLight!}
                                imgDark={logoUrlDark!}
                                width={250}
                                height={120}
                            />
                        )}
                        <Text
                            as="h2"
                            variant="bodyBold1"
                            textAlign="center"
                            fontSize={40}
                        >
                            Leaderboard
                        </Text>
                    </Flex>
                    <Text variant="body2" textAlign="center" color="accent">
                        The leading customers ranked by total points claimed.
                    </Text>
                    <Leaderboard
                        smartContractAddress={pointsContractAddress}
                        initialTab={leaderboardTab}
                    />
                </Flex>
            </Container>
        </>
    );
};

const Container = styled.div`
    ${containerFluid};
`;

export default BusinessLeaderboard;

export async function getServerSideProps(context: NextPageContext) {
    const slug = context.query?.slug as string;

    if (pages[slug] == null) {
        return { redirect: { destination: "/" } };
    }

    return {
        props: {
            ...pages[slug],
            slug,
        },
    };
}

const BusinessLogo = styled(Box)<{
    imgLight: string;
    imgDark: string;
}>`
    background-image: url(${(props) => props.imgLight});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    ${(props) => dark`
        background-image: url(${props.imgDark});
    `}
`;

const pages: Record<string, Omit<BusinessLeaderboardPageProps, "slug">> = {
    scheckter: {
        pointsContractAddress: "0x5D431bc82b67C070639E747c50A13CfF15403F18",
        logoUrlLight: "/img/logo__schecker--white.png",
        logoUrlDark: "/img/logo__schecker.png",
        bannerUrlMobile: "/img/schecker__banner--desktop.png",
        bannerUrlDesktop: "/img/schecker__banner--desktop.png",
    },
    Sweat1000: {
        pointsContractAddress: "0xC40BC08aF312ca03592a54F96fB34c10bd10Cb37",
        logoUrlLight: "/img/business_logo_sweat1000_light.png",
        logoUrlDark: "/img/business_logo_sweat1000_dark.png",
        bannerUrlMobile: "/img/business_sweat_1000_banner.png",
        bannerUrlDesktop: "/img/business_sweat_1000_banner.png",
    },
};
