import { useUserData } from "@/hooks/useUserData";
import { getCookie } from "cookies-next";
import { NextPageContext } from "next";
import { useState } from "react";
import { IoBanSharp } from "react-icons/io5";
import styled, { useTheme } from "styled-components";
import useSWR from "swr";
import { BurnMintingContext } from "../../../components/BurnMintingSingle/BurnMintingContext";
import { VideoPlayer } from "../../../components/BurnMintingSingle/VideoPlayer";
import { Flex } from "../../../components/common/Flex";
import { Text } from "../../../components/common/Text";
import { useConnex } from "../../../components/ConnexProvider";
import Head from "../../../components/Head";
import { GetBurnMintInfoQueryResult } from "../../../generated/graphql";
import {
    BatchSelectProvider,
    TokenBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import { GraphQLService } from "../../../services/GraphQLService";
import variables from "../../../styles/_variables";

const { typography, breakpoints } = variables;

const BURN_EVENT_DATE = "3 Nov 2022 20:00:00 GMT";

export default function VebounceBlockchainLottery(
    collection: GetBurnMintInfoQueryResult["collection"]
) {
    const theme = useTheme();
    const { user: userData } = useUserData();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitted, setSubmitted] = useState(false);

    const { getBurnMintInfo } = useConnex();
    const { user } = useUserData();

    const { data: collectionInfo } = useSWR(
        [collection!.burnContractAddress!, "BURN_MINT_COLLECTION_INFO"],
        (burnContractAddress) => getBurnMintInfo(burnContractAddress),
        { refreshInterval: 1000 }
    );

    if (userData?.blacklisted) {
        return (
            <Flex flexDirection="column" alignItems="center" pt={6}>
                <IoBanSharp size={160} color={theme.colors.error} />
                <Text variant="body1" mt={3}>
                    Your account has been banned
                </Text>
            </Flex>
        );
    }

    return (
        <>
            <Head
                title={`${collection!.name} - Burning`}
                description={collection!.description || undefined}
                image={
                    collection!.thumbnailImageUrl ||
                    collection!.bannerImageUrl ||
                    undefined
                }
            />

            <Container>
                <Banner src="/img/vechain_explus_banner.jpg" />
                <Subtitle>VEBOUNCE BLOCKCHAIN LOTTERY</Subtitle>
                <Title>
                    Win a ticket to the Nitto ATP Finals + Awesome Special VNFTs
                </Title>
                <VideoPlayer src="https://player.vimeo.com/video/766808899?h=6b2e018f13" />
                <Info>
                    Play the lottery by submitting your VeBounce. Each
                    collectible can only be used once. Only 1000 slots available
                    on a first come, first served basis.
                </Info>

                <BatchSelectProvider
                    context={TokenBatchSelectContext}
                    getId={(t) => t.tokenId}
                    alwaysActive
                >
                    <BurnMintingContext.Provider
                        value={{
                            currentStep,
                            setCurrentStep,
                            isSubmitted,
                            setSubmitted,
                            collection,
                            collectionInfo,
                        }}
                    >
                        <Text variant="body1">The event is over.</Text>
                        {/* {Date.now() < new Date(BURN_EVENT_DATE).getTime() &&
                        !user?.isAdmin ? (
                            <>
                                <Text variant="body1">
                                    The event will start on{" "}
                                    {new Date(BURN_EVENT_DATE).toLocaleString(
                                        "en-US",
                                        { timeZone: "UTC" }
                                    )}{" "}
                                    UTC
                                </Text>
                            </>
                        ) : (
                            <>
                                <BurnMintingTokensLeft />
                                <BurnMintingContent />
                                <BurnMintingNextButton />
                            </>
                        )} */}
                    </BurnMintingContext.Provider>
                </BatchSelectProvider>
            </Container>
        </>
    );
}

export async function getServerSideProps(context: NextPageContext) {
    const jwt = getCookie("jwt", context)?.toString();

    if (!jwt) return { redirect: { destination: "/login" } };

    const res = await GraphQLService.sdk().GetBurnMintInfo({
        customUrl: "VeBounce",
    });

    if (!res.collection?.burnContractAddress) {
        throw new Error("Collection does not have burn mint support.");
    }

    return { props: res.collection };
}

const Container = styled.div`
    padding-inline: 16px;
    padding-bottom: 32px;
    margin-inline: auto;
    max-width: min(100%, ${breakpoints.x});
    display: flex;
    flex-direction: column;
    align-items: center;

    > * + * {
        margin-top: 32px;
    }
`;

const Title = styled.h1`
    ${typography.h4}
    text-align: center;

    @media (max-width: ${breakpoints.a}) {
        ${typography.captionBold1}
    }
`;

const Subtitle = styled.h2`
    ${typography.h3}
    text-align: center;

    @media (max-width: ${breakpoints.a}) {
        ${typography.h4}
    }
`;

const Info = styled.p`
    ${typography.captionBold1}
    text-align: center;
    max-width: ${breakpoints.f};
`;

const Banner = styled.img`
    object-fit: contain;
    width: 100vw;
`;
