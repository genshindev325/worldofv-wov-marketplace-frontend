import { useBlockchain } from "@/blockchain/BlockchainProvider";
import ReadMore from "@/components/ReadMore";
import useGraphQL from "@/hooks/useGraphQL";
import { useUserDataLegacy } from "@/hooks/useUserData";
import { getPaymentFromContractAddress } from "@/utils/getPaymentFromContractAddress";
import BigNumber from "bignumber.js";
import Linkify from "linkify-react";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { FaShippingFast } from "react-icons/fa";
import { HiOutlineCubeTransparent, HiOutlineLink } from "react-icons/hi";
import { toast } from "react-toastify";
import styled, { useTheme } from "styled-components";
import ZERO_ADDRESS from "../../constants/zeroAddress";
import ModalBurnToken from "../../modals/ModalBurnToken";
import ModalBuy from "../../modals/ModalBuy";
import ModalOffer from "../../modals/ModalOffer";
import ModalSelectEdition from "../../modals/ModalSelectEdition";
import ModalSell from "../../modals/ModalSell";
import ModalTransferToken from "../../modals/ModalTransferToken";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { PurchaseCurrency, PURCHASE_CURRENCIES } from "../../types/Currencies";
import { EditionData } from "../../types/EditionData";
import { OfferType, OFFER_TYPES } from "../../types/OfferData";
import { isSameAddress } from "../../utils/isSameAddress";
import { Alert } from "../common/Alert";
import { Box } from "../common/Box";
import { Button } from "../common/Button";
import { CertifiedProduct } from "../common/CertifiedProduct";
import { Flex } from "../common/Flex";
import { Spacer } from "../common/Spacer";
import { Text } from "../common/Text";
import { useConnex } from "../ConnexProvider";
import EditionSelector from "../EditionSelector";
import ConditionalWrapper from "../HOC/ConditionalWrapper";
import Link from "../Link";
import PillsNav, { NavItemProps } from "../PillsNav";
import { useRefresh } from "../RefreshContext";
import TokenAttributeList from "../TokenAttributeList";
import UserPreviewItem from "../UserPreviewItem";
import { ProductDetailMoreActions } from "./ProductDetailMoreActions";
import OfferButton from "./ProductDetailOfferButton";
import ProductDetailOffers from "./ProductDetailOffers";
import { useItem } from "./ProductDetailProvider";
import ProductDetailStakingTab from "./ProductDetailStakingTab";

const { media, dark } = mixins;
const {
    colors: { neutrals, blue },
    typography: { h3, h4, body2, caption2 },
} = variables;

const ProductDetailContent = () => {
    const user = useUserDataLegacy();
    const router = useRouter();
    const theme = useTheme();
    const { sdk } = useGraphQL();

    const { saleService, transactionService, exchangeService } =
        useBlockchain();

    const { createBidAuction, checkTransaction, burn } = useConnex();

    const {
        token,
        selectedEdition,
        setSelectedEdition,
        mutateEditions,
        mutateToken,
    } = useItem();
    const refreshProfile = useRefresh(
        "profile-tab",
        "collection-tab",
        "profile-tab-collection"
    );

    const blockchain = useBlockchain();

    const canPerformPurchase = useMemo(
        () =>
            (!user || user.canBuy) &&
            token.canBeBought &&
            !selectedEdition?.owner?.blacklisted,
        [selectedEdition?.owner?.blacklisted, token.canBeBought, user]
    );

    const isOnCooldown = useMemo(
        () => (selectedEdition?.cooldownEnd || 0) > Date.now() / 1000,
        [selectedEdition]
    );

    const [isBuyOpen, setIsBuyOpen] = useState(false);
    const [isOfferOpen, setIsOfferOpen] = useState(false);
    const [isSellOpen, setIsSellOpen] = useState(false);
    const [isBurnOpen, setIsBurnOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<PurchaseCurrency>(
        PURCHASE_CURRENCIES[0]
    );
    const [isBurning, setIsBurning] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isSelectEditionOpen, setIsSelectEditionOpen] = useState(false);
    const [offerType, setOfferType] = useState<OfferType>(OFFER_TYPES[0]);

    const navList = useMemo(() => {
        const navList = [];

        if (token.collection?.type === "EXTERNAL") {
            navList.push({ label: "Properties" });
        }

        navList.push({ label: "Details" });

        if (
            process.env.NEXT_PUBLIC_DISABLE_STAKING?.toLowerCase() != "true" &&
            token.collection?.stakingContractAddresses?.length &&
            isSameAddress(selectedEdition?.owner.address, user?.address)
        ) {
            navList.push({ label: "Staking" });
        }

        return navList;
    }, [token.collection, selectedEdition, user]);

    const [selectedTab, setSelectedTab] = useState(navList[0].label);

    useEffect(() => {
        if (selectedEdition) {
            const currencyAddress = selectedEdition.saleAddressVIP180;
            const payment = getPaymentFromContractAddress(currencyAddress);
            setSelectedCurrency(payment as "VET" | "WoV");
        }
    }, [selectedEdition]);

    const onTabChange = (item: NavItemProps) => setSelectedTab(item.label);

    const onShare = async () => {
        if (process.browser) {
            try {
                await navigator.clipboard.writeText(location.href);
                toast.info("URL copied to clipboard");
            } catch (err) {
                toast.error("An error occurred while copying the URL");
            }
        }
    };

    const onCancelSale = async () => {
        if (selectedEdition) {
            try {
                const clause = await saleService!.cancel({
                    saleId: selectedEdition.saleId!,
                    smartContractAddress: token.smartContractAddress,
                    tokenId: selectedEdition.id,
                });

                await transactionService!.runTransaction({
                    clauses: [clause],
                    comment: `Cancel sale.`,
                    eventNames: ["cancel", "cancelNonCustodial"],
                });

                await mutateEditions();
            } catch (error) {
                console.warn(error);
            }
        }
    };

    const onSell = async (values: any) => {
        if (!user?.canSell) return;
        if (isOnCooldown) return;

        let editionsToSell: any[] = [];

        const addressVIP180 =
            values.currency.value === "WoV"
                ? process.env.NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS
                : ZERO_ADDRESS;

        if (values.sellMultiple) {
            editionsToSell = token
                .getEditionsOwnedBy(user.address)
                .sort((a, b) => {
                    // Place tokens already on sale last.
                    if (!a.saleId === !b.saleId) {
                        return a.editionNumber - b.editionNumber;
                    } else {
                        return a.saleId ? 1 : -1;
                    }
                })
                .reduce((acc, e) => {
                    acc.push({
                        smartContractAddress: token.smartContractAddress,
                        tokenId: e.id,
                        previousSaleId: e.saleId,
                        sellerAddress: user.address,
                        priceWei: new BigNumber(values.price).times(1e18),
                        addressVIP180,
                    });

                    return acc;
                }, [] as any[])
                .slice(0, values.editionsCount);
        } else {
            editionsToSell = [
                {
                    smartContractAddress: token.smartContractAddress,
                    tokenId:
                        values.selectedEditionID?.value || selectedEdition.id,
                    previousSaleId: selectedEdition.saleId,
                    sellerAddress: user.address,
                    priceWei: new BigNumber(values.price).times(1e18),
                    addressVIP180,
                },
            ];
        }

        try {
            const clauses = await saleService!.sell(...editionsToSell);

            await transactionService!.runTransaction({
                clauses,
                comment: `Sell ${editionsToSell.length} NFT(s)`,
                eventNames: ["listingNonCustodial"],
                eventCount: editionsToSell.length,
            });
            if (values.isFreeShipping !== null) {
                const res = await sdk.UpdateFreeShipping({
                    smartContractAddress: token.smartContractAddress,
                    editionId:
                        values.selectedEditionID?.value || selectedEdition.id,
                    isFreeShipping: values.isFreeShipping,
                });
            }

            setIsSellOpen(false);

            await mutateEditions();
        } catch (error) {
            console.warn(error);
        }
    };

    const onAuction = async (values: any) => {
        if (!user?.canSell) return;
        if (isOnCooldown) return;

        try {
            const [amount, unit] = values.duration.value.split("_");

            const addressVIP180 =
                values.currency.value === "WoV"
                    ? process.env
                          .NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS
                    : ZERO_ADDRESS;

            const res = await createBidAuction(
                selectedEdition.id,
                values.reservePrice.toString(),
                moment().toDate(),
                moment(moment.now()).add(amount, unit).toDate(),
                addressVIP180,
                token.smartContractAddress
            );

            setIsSellOpen(false);

            const txRes = await checkTransaction({
                txID: res.txid,
                txOrigin: res.signer,
                eventName: "newAuction",
                toast: {
                    enabled: true,
                    success: "The auction has been created",
                },
            });

            if (values.isFreeShipping !== null) {
                await sdk.UpdateFreeShipping({
                    smartContractAddress: token.smartContractAddress,
                    editionId:
                        values.selectedEditionID?.value || selectedEdition.id,
                    isFreeShipping: values.isFreeShipping,
                });
            }

            router.push(`/auction/${txRes.returnValues.auctionId}`);
        } catch (error) {
            console.warn(error);
        }
    };

    const onBuy = async (edition: EditionData) => {
        if (!user?.canBuy) return;

        if (edition && edition.price && edition.payment) {
            try {
                const sellCurrency = selectedEdition!.payment!;
                const sellPrice = new BigNumber(selectedEdition!.price!);

                const clauses: Connex.VM.Clause[] = [];

                if (sellCurrency !== selectedCurrency) {
                    const amountInWei = await exchangeService!.getAmountsIn({
                        amountOutWei: sellPrice,
                        fromCurrency: selectedCurrency,
                        toCurrency: sellCurrency,
                    });

                    const swapClauses = await exchangeService!.swap({
                        amountInWei,
                        amountOutWei: sellPrice,
                        fromCurrency: selectedCurrency,
                        toCurrency: sellCurrency,
                        recipientAddress: user!.address,
                    });

                    clauses.push(...swapClauses);
                }

                const buyClauses = await saleService!.buy({
                    smartContractAddress: token.smartContractAddress,
                    tokenId: selectedEdition.id,
                    saleId: selectedEdition.saleId!,
                    priceWei: sellPrice,
                    payment: sellCurrency,
                });

                clauses.push(...buyClauses);

                await transactionService!.runTransaction({
                    clauses,
                    comment: `Buy 1 NFT`,
                    eventNames: ["purchaseNonCustodial"],
                });

                await mutateEditions();

                setIsBuyOpen(false);
            } catch (error) {
                console.warn(error);
            }
        }
    };

    const onTransfer: SubmitHandler<any> = async (values) => {
        if (!user?.canTransfer) return;
        if (isOnCooldown) return;
        if (selectedEdition) {
            try {
                const clauses = await blockchain.nftService!.transfer([
                    {
                        from: selectedEdition.owner.address,
                        to: values.to,
                        tokenId: selectedEdition.id,
                        smartContractAddress: token.smartContractAddress,
                    },
                ]);

                await blockchain.transactionService!.runTransaction({
                    clauses,
                    comment: `Tansfering NFT to ${values.to}`,
                });

                setIsTransferOpen(false);

                await mutateEditions();
            } catch (error) {
                console.warn(error);
            }
        }
    };

    const onBurn = async () => {
        if (!user?.canTransfer) return;
        if (isOnCooldown) return;

        setIsBurning(true);

        if (selectedEdition) {
            try {
                const res = await burn(
                    token.smartContractAddress,
                    token.id,
                    selectedEdition.owner.address,
                    selectedEdition.id
                );

                await checkTransaction({
                    txID: res.txid,
                    txOrigin: res.signer,
                    toast: {
                        enabled: true,
                        success: "You have successfully burned your NFT!",
                    },
                });

                await mutateToken();
                await mutateEditions();
                await refreshProfile();

                if (token.editions.length === 1) {
                    router.push(`/profile/${user.profileIdentifier}`);
                }
            } catch (error) {
                console.warn(error);
            } finally {
                setIsBurnOpen(false);
                setIsBurning(false);
            }
        }
    };

    const onGlobalOffer = () => {
        setOfferType("TOKEN");
        setIsOfferOpen(true);
    };

    const onEditionOffer = () => {
        setOfferType("EDITION");
        setIsOfferOpen(true);
    };

    const ownedEditions = useMemo(
        () => (user ? token.getEditionsOwnedBy(user.address) : []),
        [token, user]
    );

    // Only populated for Phygital tokens.
    const provenanceUrl = useMemo(
        () =>
            token.attributes?.find((a) => a.trait_type === "provenance")?.value,
        [token.attributes]
    );

    const isPhygital = useMemo(
        () =>
            token.attributes?.find(
                (a) => a.trait_type === "nfcChip" || a.trait_type === "NFC-Chip"
            )?.value,
        [token.attributes]
    );
    const isMVACollection =
        token.collection?.name == "Mad Ⓥ-Apes - Phoenix" ||
        token.collection?.name == "Mad Ⓥ-Apes Elementals" ||
        token.collection?.name == "Mad Ⓥ-Apes - Fusion" ||
        token.collection?.name == "Mad Ⓥ-Apes";

    const moreActionsPopup = (
        <ProductDetailMoreActions
            onBurn={() => setIsBurnOpen(true)}
            onTransfer={() => setIsTransferOpen(true)}
            onShare={onShare}
            onViewOriginal={() => {
                window
                    ?.open(token.assets[token.assets.length - 1].url, "_blank")
                    ?.focus();
            }}
            token={token}
            canPerformPurchase={canPerformPurchase}
            selectedEdition={selectedEdition}
            userAddress={user?.address}
        />
    );

    const offerButton = (
        <OfferButton
            onGlobalOffer={onGlobalOffer}
            onEditionOffer={onEditionOffer}
            canPerformPurchase={canPerformPurchase}
        />
    );

    return (
        <Container>
            <InfoWrapper>
                {isPhygital && (
                    <Flex height={50} alignItems="center" rowGap={2} mb={4}>
                        <Flex
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor={theme.colors.primary}
                            borderRadius="50%"
                            p={1}
                        >
                            <HiOutlineCubeTransparent
                                fontSize={40}
                                color="white"
                            />
                        </Flex>
                        <Link href="/phygitals" passHref>
                            <a>
                                <Text variant="bodyBold1" color="primary">
                                    NFT &amp; Phygital
                                </Text>
                            </a>
                        </Link>
                    </Flex>
                )}

                <Title>{token.name}</Title>

                {token.collection?.name && (
                    <Link
                        href={
                            token.collection?.id ||
                            token.collection?.collectionId
                                ? `/collection/${
                                      token.collection.customUrl ||
                                      token.collection.id ||
                                      token.collection.collectionId
                                  }`
                                : undefined
                        }
                        passHref
                    >
                        <Collection>{token.collection.name}</Collection>
                    </Link>
                )}
            </InfoWrapper>

            {navList.length > 1 && (
                <StyledPillsNav
                    items={navList}
                    value={selectedTab}
                    onChange={onTabChange}
                />
            )}

            {selectedTab === "Staking" && <ProductDetailStakingTab />}

            {selectedTab === "Properties" && (
                <TokenAttributeList
                    attributes={token.attributes}
                    rank={token.rank}
                    score={token.score}
                />
            )}

            {selectedTab === "Details" && (
                <DetailsContainer>
                    {token.description && (
                        <Description>
                            <Linkify
                                options={{
                                    ignoreTags: ["script", "style"],
                                }}
                            >
                                <ReadMore lines={20} withToggle>
                                    {token.description}
                                </ReadMore>
                            </Linkify>
                        </Description>
                    )}

                    {isPhygital && (
                        <ConditionalWrapper
                            isRendered={!!provenanceUrl}
                            wrapper={(children) => (
                                <Link href={provenanceUrl as string} passHref>
                                    <a target="_blank">{children}</a>
                                </Link>
                            )}
                        >
                            <>
                                <CertifiedProduct
                                    isAuthenticated={!!provenanceUrl}
                                />
                                <Spacer y size={5} />
                            </>
                        </ConditionalWrapper>
                    )}

                    <Users>
                        {token?.creator ? (
                            <UserPreviewItem
                                label="Creator"
                                user={token.creator!}
                                hrefPrefix={
                                    isSameAddress(
                                        token.creator.address,
                                        token.smartContractAddress
                                    )
                                        ? "/collection"
                                        : undefined
                                }
                                isProductPage
                            />
                        ) : null}

                        {selectedEdition && (
                            <UserPreviewItem
                                label="Owner"
                                user={selectedEdition.owner}
                                isProductPage
                            />
                        )}
                    </Users>
                </DetailsContainer>
            )}

            {selectedTab !== "Staking" && (
                <>
                    <BottomWrapper
                        withBorder={
                            (token?.collection?.type === "EXTERNAL" ||
                                token.editionsCount < 2) &&
                            selectedEdition?.isOnSale
                        }
                    >
                        <EditionSelector
                            token={token}
                            selectedEdition={selectedEdition}
                            onClick={() => setIsSelectEditionOpen(true)}
                            ownedEditionsCount={ownedEditions.length}
                        />

                        {provenanceUrl && selectedEdition?.isOnSale && (
                            <Flex alignItems="center" rowGap={3} mt={3}>
                                <FaShippingFast
                                    color={theme.colors.primary}
                                    fontSize={30}
                                />
                                {selectedEdition?.isFreeShipping ? (
                                    <Box>
                                        <Text
                                            variant="bodyBold2"
                                            color="primaryDark10"
                                        >
                                            FREE International Shipping
                                        </Text>

                                        <Link
                                            href={`mailto:${selectedEdition.owner.email}`}
                                        >
                                            <a>
                                                <Flex
                                                    alignItems="center"
                                                    rowGap={1}
                                                >
                                                    <HiOutlineLink
                                                        color={
                                                            theme.colors.primary
                                                        }
                                                        fontSize={14}
                                                    />
                                                    <Text
                                                        variant="bodyBold2"
                                                        color="primaryDark10"
                                                        whiteSpace="nowrap"
                                                        underline
                                                        fontSize={{
                                                            _: "12px",
                                                            s: "16px",
                                                        }}
                                                        fontWeight={700}
                                                    >
                                                        Contact the owner
                                                    </Text>
                                                </Flex>
                                            </a>
                                        </Link>
                                    </Box>
                                ) : (
                                    <Flex rowGap={1} flexWrap="wrap">
                                        <Link
                                            href={`mailto:${selectedEdition.owner.email}`}
                                        >
                                            <a>
                                                <Flex
                                                    alignItems="center"
                                                    rowGap={1}
                                                >
                                                    <HiOutlineLink
                                                        color={
                                                            theme.colors.primary
                                                        }
                                                        fontSize={14}
                                                    />
                                                    <Text
                                                        variant="bodyBold2"
                                                        color="primaryDark10"
                                                        whiteSpace="nowrap"
                                                        underline
                                                        fontSize={{
                                                            _: "12px",
                                                            s: "16px",
                                                        }}
                                                        fontWeight={700}
                                                    >
                                                        Contact the owner
                                                    </Text>
                                                </Flex>
                                            </a>
                                        </Link>

                                        <Text
                                            variant="body2"
                                            color="primary"
                                            mt="1px"
                                            whiteSpace="nowrap"
                                            fontSize={{
                                                _: "12px",
                                                s: "16px",
                                            }}
                                        >
                                            for shipping costs
                                        </Text>
                                    </Flex>
                                )}
                            </Flex>
                        )}
                        <ButtonWrapper>
                            {selectedEdition?.auction ? (
                                <Link
                                    href={`/auction/${selectedEdition.auction.id}`}
                                >
                                    <a>
                                        {selectedEdition.auction?.ended &&
                                        !selectedEdition.auction.settled ? (
                                            user ? (
                                                isSameAddress(
                                                    user.address,
                                                    selectedEdition.auction
                                                        .sellerAddress
                                                ) ||
                                                isSameAddress(
                                                    user.address,
                                                    selectedEdition.auction
                                                        .bidderAddress
                                                ) ? (
                                                    <Button>
                                                        Auction to settle
                                                    </Button>
                                                ) : null
                                            ) : null
                                        ) : (
                                            <Button>
                                                On auction for{" "}
                                                {selectedEdition.auction
                                                    .currentBid
                                                    ? selectedEdition.auction
                                                          .formattedCurrentBid
                                                    : selectedEdition.auction
                                                          .formattedReservePrice}{" "}
                                                {
                                                    selectedEdition.auction
                                                        .payment
                                                }
                                            </Button>
                                        )}
                                    </a>
                                </Link>
                            ) : selectedEdition?.stakingContractAddress ? (
                                <ButtonGroup>
                                    {offerButton}
                                    {moreActionsPopup}
                                </ButtonGroup>
                            ) : selectedEdition?.isOnSale ? (
                                isSameAddress(
                                    selectedEdition.owner.address,
                                    user?.address
                                ) ? (
                                    <ButtonGroup>
                                        <Button onClick={onCancelSale}>
                                            Cancel Sale
                                        </Button>

                                        {selectedEdition.saleId && (
                                            <>
                                                <Button
                                                    outline
                                                    disabled={
                                                        !canPerformPurchase
                                                    }
                                                    onClick={() =>
                                                        setIsSellOpen(true)
                                                    }
                                                >
                                                    Update Price
                                                </Button>

                                                {moreActionsPopup}
                                            </>
                                        )}
                                    </ButtonGroup>
                                ) : (
                                    <>
                                        <ButtonGroup>
                                            {user ? (
                                                <>
                                                    <Button
                                                        onClick={() =>
                                                            setIsBuyOpen(true)
                                                        }
                                                        disabled={
                                                            !canPerformPurchase
                                                        }
                                                    >
                                                        Buy now
                                                    </Button>

                                                    {offerButton}
                                                </>
                                            ) : (
                                                <Link href="/login" passHref>
                                                    <Button as="a">
                                                        Buy now
                                                    </Button>
                                                </Link>
                                            )}

                                            {moreActionsPopup}
                                        </ButtonGroup>
                                    </>
                                )
                            ) : (
                                <>
                                    {isSameAddress(
                                        selectedEdition?.owner.address,
                                        user?.address
                                    ) ? (
                                        <>
                                            {isOnCooldown &&
                                            selectedEdition.cooldownEnd ? (
                                                <Alert
                                                    variant="info"
                                                    style={{
                                                        marginBottom: 16,
                                                    }}
                                                    title="This NFT is currently locked due to burning"
                                                    text={`The cooldown period will expire on: ${moment(
                                                        selectedEdition.cooldownEnd *
                                                            1000
                                                    ).format("LLL")}`}
                                                />
                                            ) : null}

                                            <ButtonGroup>
                                                <Button
                                                    onClick={
                                                        !isOnCooldown &&
                                                        (user?.canSell ||
                                                            token.canBeSold)
                                                            ? () =>
                                                                  setIsSellOpen(
                                                                      true
                                                                  )
                                                            : undefined
                                                    }
                                                    disabled={
                                                        isOnCooldown ||
                                                        !user?.canSell ||
                                                        !token.canBeSold
                                                    }
                                                >
                                                    Sell
                                                </Button>

                                                {moreActionsPopup}
                                            </ButtonGroup>
                                        </>
                                    ) : (
                                        <ButtonGroup>
                                            {offerButton}
                                            {moreActionsPopup}
                                        </ButtonGroup>
                                    )}
                                </>
                            )}

                            {!!token.royalty && (
                                <>
                                    <Royalty>
                                        Creator of this NFT will receive{" "}
                                        {token.royalty}% royalties
                                    </Royalty>

                                    {isMVACollection && (
                                        <Royalty>
                                            1.5% of sales done in VET will go to
                                            Mad ⓥ-Apes DAO
                                        </Royalty>
                                    )}
                                </>
                            )}

                            {!canPerformPurchase ? (
                                <Alert
                                    style={{ marginTop: 16 }}
                                    title={
                                        !token.canBeBought
                                            ? "The artist has been banned"
                                            : !user?.canBuy
                                            ? "Your account has been banned"
                                            : "The owner of this NFT has been banned"
                                    }
                                />
                            ) : null}
                        </ButtonWrapper>
                    </BottomWrapper>

                    <ProductDetailOffers />
                </>
            )}

            <ModalOffer
                isOpen={isOfferOpen}
                setIsOpen={setIsOfferOpen}
                offerType={offerType}
            />

            <ModalBuy
                isOpen={isBuyOpen}
                setIsOpen={setIsBuyOpen}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                onBuy={onBuy}
            />

            <ModalSell
                isOpen={isSellOpen}
                setIsOpen={setIsSellOpen}
                {...{ onSell, onAuction }}
            />

            <ModalBurnToken
                isOpen={isBurnOpen}
                isBurning={isBurning}
                setIsOpen={setIsBurnOpen}
                onBurn={onBurn}
            />

            <ModalTransferToken
                isOpen={isTransferOpen}
                setIsOpen={setIsTransferOpen}
                onTransfer={onTransfer}
            />

            <ModalSelectEdition
                onSelect={(edition) => {
                    setSelectedEdition(edition);
                    setIsSelectEditionOpen(false);
                }}
                isOpen={isSelectEditionOpen}
                setIsOpen={setIsSelectEditionOpen}
            />
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 40%;
    margin-left: 40px;
    padding-left: 40px;
    border-left: 1px solid ${neutrals[6]};

    ${dark`
        border-color: ${neutrals[3]};
    `}

    ${media.d`
        width: 50%;
    `}

    ${media.t`
        margin-left: 0;
        padding-left: 0;
        border-left: inherit;
        width: 100%;
    `}
`;

const InfoWrapper = styled.div`
    margin-bottom: 32px;
`;

const Title = styled.h1`
    ${h3};
    ${media.s`
        ${h4};
    `}
    margin-bottom: 8px;
    word-wrap: break-word;
`;

const Collection = styled.div`
    cursor: pointer;
    width: fit-content;
    ${body2};
    color: ${neutrals[4]};
    transition: color 0.2s;

    &:hover {
        color: ${blue};
    }
`;

const StyledPillsNav = styled(PillsNav)`
    padding-bottom: 16px;
    border-bottom: 1px solid ${neutrals[6]};

    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

const DetailsContainer = styled.div`
    padding-top: 16px;
`;

const Description = styled.p`
    margin-bottom: 40px;
    ${body2};
    color: ${neutrals[4]};
    word-break: break-word;
    white-space: pre-line;

    a {
        text-decoration: underline;
        font-weight: 500;
        color: ${neutrals[2]};

        ${dark`
            color: ${neutrals[8]};
        `}

        &:hover {
            text-decoration: none;
        }
    }
`;

const Provenance = styled(Description)`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Users = styled.div`
    > ${UserPreviewItem.displayName} {
        &:not(:last-child) {
            padding-bottom: 16px;
            margin-bottom: 16px;
            border-bottom: 1px solid ${neutrals[6]};

            ${dark`
                border-color: ${neutrals[3]};
            `}
        }
    }
`;

const BottomWrapper = styled.div<{ withBorder: boolean }>`
    margin-top: auto;
    border: ${({ theme, withBorder }) =>
        withBorder ? `1px solid ${theme.colors.muted}` : "none"};
    border-radius: ${({ theme, withBorder }) =>
        withBorder ? theme.radii[4] : 0}px;
    padding: ${({ theme, withBorder }) => (withBorder ? theme.space[3] : 0)}px;
    margin-top: ${({ theme, withBorder }) =>
        withBorder ? theme.space[4] : 0}px;
`;

const ButtonWrapper = styled.div`
    margin-top: 16px;

    ${Button}, ${Link.name} {
        width: 100%;
    }
`;

const ButtonGroup = styled.div`
    display: flex;

    > * {
        flex: 1;

        &:not(:first-child) {
            margin-left: 8px;
        }
    }
`;

const Royalty = styled.div`
    margin-top: 4px;
    text-align: center;
    color: ${neutrals[4]};
    ${caption2};
`;

export default ProductDetailContent;
