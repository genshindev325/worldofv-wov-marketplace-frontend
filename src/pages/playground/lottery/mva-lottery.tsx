import Link from "@/components/Link";
import { useUserData } from "@/hooks/useUserData";
import { getCookie } from "cookies-next";
import { NextPageContext } from "next";
import { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import BurnMintingContent from "../../../components/BurnMintingSingle/BurnMintingContent";
import { BurnMintingContext } from "../../../components/BurnMintingSingle/BurnMintingContext";
import BurnMintingNextButton from "../../../components/BurnMintingSingle/BurnMintingNextButton";
import BurnMintingTokensLeft from "../../../components/BurnMintingSingle/BurnMintingTokensLeft";
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

const BURN_EVENT_DATE = "28 Feb 2023 16:00:00 GMT"; // to change

export default function WoVLottery(
    collection: GetBurnMintInfoQueryResult["collection"]
) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitted, setSubmitted] = useState(false);

    const { getBurnMintInfo } = useConnex();
    const { user } = useUserData();

    const { data: collectionInfo } = useSWR(
        [collection!.burnContractAddress!, "BURN_MINT_COLLECTION_INFO"],
        (burnContractAddress) => getBurnMintInfo(burnContractAddress),
        { refreshInterval: 5000 }
    );

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
                <Banner src="/img/mva_lottery_banner.png" />
                {/* <Subtitle>LOTTERY EVENT</Subtitle> */}
                {/* <Title>WoV Lottery</Title> */}
                <Info>
                    Each MVA Alpha Icon Raffle Ticket offers a chance to win the
                    coveted MVA Spidey Icon NFT along with many other great
                    prizes included in the{" "}
                    <Link
                        href="https://worldofv.art/profile/mvalottery"
                        passHref
                    >
                        <StyledA>MVA Lottery Vault</StyledA>
                    </Link>
                    !
                    <br />1 Ticket = 1 Entry
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
                        {Date.now() < new Date(BURN_EVENT_DATE).getTime() &&
                        !user?.isAdmin ? (
                            <>
                                <Text>
                                    The event will start at{" "}
                                    {new Date(BURN_EVENT_DATE).toLocaleString()}
                                </Text>
                            </>
                        ) : (
                            <>
                                <BurnMintingTokensLeft />
                                <BurnMintingContent />
                                <BurnMintingNextButton />
                            </>
                        )}
                    </BurnMintingContext.Provider>
                </BatchSelectProvider>
            </Container>
        </>
    );
}

export async function getServerSideProps(context: NextPageContext) {
    const jwt = getCookie("jwt", context)?.toString();

    if (!jwt) return { redirect: { destination: "/login" } };

    // const { address } = parseJwt(jwt);

    // const userRes = await GraphQLService.sdk()
    //     .GetUser({ address })
    //     .catch(() => null);

    // if (
    //     Date.now() < new Date(BURN_EVENT_DATE).getTime() &&
    //     !userRes?.user?.isAdmin
    // ) {
    //     return { redirect: { destination: "/" } };
    // }

    const res = await GraphQLService.sdk().GetBurnMintInfo({
        customUrl: "MVATickets",
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
    ${typography.h2}
    text-align: center;

    @media (max-width: ${breakpoints.a}) {
        ${typography.h4}
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

const Text = styled.p`
    ${typography.body1}
`;

const Banner = styled.img`
    object-fit: contain;
    width: 100vw;
`;

const StyledA = styled.a`
    color: ${({ theme }) => theme.colors.primary};
`;
