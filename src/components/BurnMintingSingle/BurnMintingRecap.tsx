import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { Card } from "@/components/cards/CardV2";
import { userAddressSelector } from "@/store/selectors";
import _ from "lodash";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { MarketplaceTokenFragment } from "../../generated/graphql";
import { TokenBatchSelectContext } from "../../providers/BatchSelectProvider";
import { Button } from "../common/Button";
import { Flex } from "../common/Flex";
import { Spacer } from "../common/Spacer";
import { Text } from "../common/Text";
import { BurnMintingContext } from "./BurnMintingContext";
import { WheelAnimation } from "./WheelAnimation";
import WinningCard from "./WinningCard";

const CONFETTI_ROUNDS = 5;
const CONFETTI_DURATION = 1500;
const ART_COLLECTION = "0x5E6265680087520DC022d75f4C45F9CCD712BA97";

export default function BurnMintingRecap() {
    const blockchain = useBlockchain();
    const userAddress = useRecoilValue(userAddressSelector);
    const router = useRouter();

    const { collection, isSubmitted, setSubmitted } =
        useContext(BurnMintingContext);
    const { selectedItems } = useContext(TokenBatchSelectContext);

    const [fromBlock, setFromBlock] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [tokensCoordinates, setTokensCoordinates] = useState<
        { tokenId: string; collection: string }[]
    >([
        // {
        //     tokenId: "11100401900000",
        //     collection: "0x5E6265680087520DC022d75f4C45F9CCD712BA97",
        // },
    ]);
    const [confettiRound, setConfettiRound] = useState(0);
    const [isWinner, setIsWinner] = useState(false);

    // We fetch the token image directly from the blockchain since the backend
    // might be too slow to keep up with the volume of mints during an event.
    const fetchTokenFromBlockchain = useCallback(async () => {
        const response = await blockchain.burnMintService!.getLatestMintedToken(
            {
                smartContractAddress: collection!.burnContractAddress!,
                userAddress: userAddress!,
                contractName: "StandardNFT",
                fromBlock,
                count: selectedItems.count(),
            }
        );

        setTokensCoordinates(
            response!.map((coord) => _.pick(coord, ["tokenId", "collection"]))
        );
    }, [
        blockchain.burnMintService,
        collection,
        userAddress,
        fromBlock,
        selectedItems,
    ]);
    useEffect(
        () => {
            if (isSubmitted) fetchTokenFromBlockchain();
        },
        [isSubmitted] // eslint-disable-line react-hooks/exhaustive-deps
    );

    useEffect(() => {
        setIsWinner(
            tokensCoordinates.some(
                (coord) => coord.collection !== collection!.burnContractAddress!
            )
        );
    }, [collection, tokensCoordinates]);

    useEffect(() => {
        if (!isWinner) return;

        const interval = setInterval(() => {
            setConfettiRound((confettiRound) => {
                if (confettiRound < CONFETTI_ROUNDS) confettiRound++;
                return confettiRound;
            });
        }, CONFETTI_DURATION);

        return () => {
            clearInterval(interval);
        };
    }, [isWinner, tokensCoordinates]);

    const onSubmit = async (): Promise<void> => {
        try {
            setLoading(true);
            setHasError(false);

            const status = blockchain!.connexService!.getBlockchainStatus();
            setFromBlock(status.head.number);

            const getTokenInfo = (t: MarketplaceTokenFragment) => ({
                tokenId: t.tokenId,
                saleId: t.minimumSaleId,
                auctionId: t.minimumAuctionId,
                onSale: !!t.editionsOnSale,
            });

            const clauses = await blockchain.burnMintService?.burnMint({
                smartContractAddress: collection?.smartContractAddress!,
                burnContractAddress: collection!.burnContractAddress!,
                tokensToBurn: selectedItems
                    .valueSeq()
                    .map(getTokenInfo)
                    .toArray(),
            });

            const gas = await blockchain.connexService?.estimateGas(clauses!);

            await blockchain.transactionService?.runTxOnBlockchain({
                clauses: clauses!,
                comment: `Burn ${selectedItems.count()} tokens`,
                gas: gas != null && gas > 400_000 ? 2 * gas : 400_000,
            });

            setSubmitted(true);
        } catch (error: any) {
            console.warn(error.message || error);
            setHasError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Container>
                {!isSubmitted && !isLoading && (
                    <CardContainer>
                        {!!selectedItems.size &&
                            selectedItems
                                .toList()
                                .map((item) => (
                                    <Card key={item.tokenId} {...item} />
                                ))}
                    </CardContainer>
                )}

                {isLoading && tokensCoordinates.length === 0 && (
                    <Flex flexDirection="column" columnGap={6} my={5}>
                        <WheelAnimation />
                        <Text variant="body1" textAlign="center">
                            <span>
                                {isLoading
                                    ? "Your submission is in! Get ready to find out if you won... Good luck 🍀"
                                    : "Loading token data..."}
                            </span>
                        </Text>
                    </Flex>
                )}

                {tokensCoordinates.length > 0 && isWinner && (
                    <Flex
                        flexDirection="column"
                        alignItems="center"
                        columnGap={3}
                    >
                        <WinningCard
                            {...tokensCoordinates[0]}
                            // In case the colleciton is an art token, replace trailing zero with a 1
                            tokenId={
                                tokensCoordinates[0].collection.toUpperCase() ===
                                ART_COLLECTION.toUpperCase()
                                    ? tokensCoordinates[0].tokenId.slice(
                                          0,
                                          -1
                                      ) + "0"
                                    : tokensCoordinates[0].tokenId
                            }
                            isWinner
                        />
                        <Button
                            style={{ backgroundColor: "#23262f" }}
                            fullWidth
                            onClick={() => {
                                router.push(`/profile/${userAddress}`);
                            }}
                        >
                            Go to Profile
                        </Button>
                    </Flex>
                )}

                {tokensCoordinates.length > 0 && !isWinner && (
                    <WinningCard
                        {...tokensCoordinates[0]}
                        isWinner={false}
                        loserUrl="/img/mva_lottery_unlucky.jpg"
                    />
                )}

                {/* {imageUrl && (
                    <div
                        style={{
                            visibility: isImageLoaded ? undefined : "hidden",
                            // This is necessary so the component will not be calculated in the
                            // flex layout when it is hidden.
                            position: isImageLoaded ? undefined : "absolute",
                        }}
                    >
                        <CardAsset>
                            <img
                                src={imageUrl}
                                alt={imageUrl}
                                onLoad={() => setImageLoaded(true)}
                            />
                        </CardAsset>
                    </div>
                )} */}

                <Spacer size={5} y />

                {!tokensCoordinates.length ? (
                    <Button
                        onClick={onSubmit}
                        loader={isLoading || isSubmitted}
                    >
                        {hasError ? "Retry" : "Play"}
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            location.reload();
                        }}
                    >
                        Play again
                    </Button>
                )}
            </Container>

            <ReactCanvasConfetti
                style={{
                    height: "100%",
                    width: "100%",
                    position: "fixed",
                    left: "0",
                    top: "0",
                    pointerEvents: "none",
                    zIndex: 20000,
                }}
                particleCount={100}
                spread={180}
                angle={-90}
                resize={true}
                ticks={600}
                origin={{ y: -0.5 }}
                fire={confettiRound}
            />
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    max-width: ${({ theme }) => theme.breakpoints.f};
    margin: auto;

    .flame-root {
        align-self: center;
    }
`;

const CardContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    pointer-events: none;

    > * {
        width: 100%;
        max-width: 328px;
        margin-top: 32px;
    }

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.s}) {
        flex-direction: row;

        > * + * {
            margin-left: 32px;
        }
    }
`;
