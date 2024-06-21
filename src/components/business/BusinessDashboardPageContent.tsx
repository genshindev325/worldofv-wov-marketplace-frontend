import { CardPlaceholder } from "@/components/cards/CardPlaceholder";
import { useRefreshListener } from "@/components/RefreshContext";
import { MarketplaceTokenFragment } from "@/generated/graphql";
import { useUserDataLegacy } from "@/hooks/useUserData";
import { FC, useState } from "react";
import styled from "styled-components";
import { useBusinessQuery } from "../../hooks/useBusinessQuery";
import AnimatedModal from "../../modals/AnimatedModal";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import { ModalMintingContent } from "../business/ModalMintingContent";
import { VoucherCard } from "../business/VoucherCard";
import { Card } from "../cards/CardV2";
import { Box } from "../common/Box";
import { Button } from "../common/Button";
import { Flex } from "../common/Flex";
import { Pill } from "../common/Pill";
import { ProgressBar } from "../common/ProgressBar";
import { Spacer } from "../common/Spacer";
import { Text } from "../common/Text";
import { WhatsappButton } from "../common/WhatsappButton";
import { useConnex } from "../ConnexProvider";
import HomeSwiper from "../Home/HomeSwiper";
import Link from "../Link";
import UserAvatar from "../UserAvatar";
import { Faqs } from "./Faqs";

const { containerLarge } = common;
const { dark } = mixins;

const getTokenInfo = (t: MarketplaceTokenFragment) => ({
    tokenId: t.tokenId,
    saleId: t.minimumSaleId,
    auctionId: t.minimumAuctionId,
    onSale: !!t.editionsOnSale,
});

export type BusinessDashboardPageContentProps = {
    slug: string;
    pointsContractAddress: string;
    pointsCollectionId: string;
    vouchersContractAddress: string;
    vouchersCollectionId: string;
    voucherImgUrl: string;
    pointName?: string;
    logoUrlLight?: string;
    logoUrlDark?: string;
    bannerUrlMobile: string;
    bannerUrlDesktop: string;
    transferToAddress?: string;
    pointsPerVoucher: number;
};

export const BusinessDashboardPageContent: FC<
    BusinessDashboardPageContentProps
> = ({
    slug,
    pointsContractAddress,
    pointsCollectionId,
    vouchersContractAddress,
    vouchersCollectionId,
    voucherImgUrl,
    pointName = "",
    logoUrlLight,
    logoUrlDark,
    bannerUrlMobile,
    bannerUrlDesktop,
    transferToAddress = "0x7F94C17A24d4a6B131e71cd8AeA3AD43196497fA",
    pointsPerVoucher,
}) => {
    const user = useUserDataLegacy();

    const { mintWithCooldown, checkTransaction, transfer } = useConnex();

    const [isLoading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const {
        error,
        loading,
        items: points,
        total,
        mutate: refreshPoints,
    } = useBusinessQuery(pointsCollectionId, 100, 1);

    const { items: vouchers, mutate: refreshVouchers } = useBusinessQuery(
        vouchersCollectionId,
        100,
        1
    );

    useRefreshListener("business-dashboard", async () => {
        await refreshPoints();
    });

    const handleClaim = async () => {
        try {
            setLoading(true);
            setHasError(false);

            // Consider the first N tokens only
            const itemsToCooldown = points.slice(0, pointsPerVoucher);

            const tx = await mintWithCooldown({
                smartContractAddress: pointsContractAddress,
                cooldownContractAddress: vouchersContractAddress,
                tokensToOwn: itemsToCooldown.map(getTokenInfo),
            });

            await checkTransaction({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: "Transfer",
                eventCount: itemsToCooldown.length,
                TIMEOUT: itemsToCooldown.length * 5000 + 30000,
                toast: {
                    enabled: true,
                    success: "Your NFT has been minted!",
                },
            });

            await refreshPoints();
            await refreshVouchers();
        } catch (error: any) {
            console.warn(error.message || error);
            setHasError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async (t: MarketplaceTokenFragment) => {
        if (user?.address == null) return;

        try {
            const res = await transfer(
                t.editions[0].ownerAddress,
                transferToAddress,
                t.editions[0].editionId,
                t.smartContractAddress
            );

            await checkTransaction({
                txID: res.txid,
                txOrigin: res.signer,
                toast: {
                    enabled: true,
                    success: "You have successfully transferred your NFT!",
                },
            });

            await refreshVouchers();
        } catch (error) {
            console.log(error);
        }
    };

    const Pills = () => (
        <>
            <Pill
                left={pointName.length > 0 ? `${pointName} Points` : "Points"}
                right={points?.length || 0}
                bg="error"
                color="white"
                width="100%"
                maxWidth={200}
            />
            <Pill
                left="Vouchers"
                right={vouchers?.length || 0}
                bg="error"
                color="white"
                width="100%"
                maxWidth={200}
            />
        </>
    );

    const GotoLeaderboardPageButton = () => (
        <Link href={`/business/leaderboard/${slug}`} passHref>
            <Button fullWidth>View Leaderboard</Button>
        </Link>
    );
    const GotoClaimPageButton = () => (
        <Link href={`/business/claim/${slug}`} passHref>
            <Button fullWidth>Go to claim page</Button>
        </Link>
    );

    return (
        <section>
            <Banner imgMobile={bannerUrlMobile} imgDesktop={bannerUrlDesktop}>
                {logoUrlLight != null && logoUrlDark != null && (
                    <Box display={{ _: "none", t: "block" }} height="100%">
                        <Flex
                            alignItems="center"
                            justifyContent="flex-end"
                            height="100%"
                            position="relative"
                        >
                            <Box py={2} px={5} bg="white">
                                <BusinessLogo
                                    imgLight={logoUrlLight}
                                    imgDark={logoUrlDark}
                                    width={464}
                                    height={127}
                                    bg="white"
                                />
                            </Box>
                        </Flex>
                    </Box>
                )}
            </Banner>

            {/* Mobile pills */}
            <Box display={{ _: "block", t: "none" }}>
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    bg="muted"
                    py={5}
                    px={4}
                    rowGap={3}
                >
                    <Pills />
                </Flex>
            </Box>
            <Container>
                <Flex
                    flexDirection={{ _: "column", t: "row" }}
                    rowGap={{ _: 0, t: 6 }}
                    mt={{ _: 0, t: 5 }}
                >
                    <Aside>
                        {/* Desktop pills */}
                        <Box
                            display={{ _: "none", t: "block" }}
                            width="100%"
                            bg="muted"
                            p={5}
                            borderTopRightRadius={5}
                            borderBottomRightRadius={5}
                        >
                            <Flex
                                flexDirection="column"
                                alignItems="center"
                                columnGap={4}
                                overflow="hidden"
                            >
                                {user != null && (
                                    <>
                                        <UserAvatar
                                            size={160}
                                            src={user!.profileImage}
                                            verified={user!.verified}
                                            verifiedLevel={user!.verifiedLevel}
                                        />
                                        <Text
                                            variant="bodyBold2"
                                            fontSize={6}
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                            whiteSpace="nowrap"
                                            mb={2}
                                        >
                                            {user.name != null
                                                ? user.name
                                                : user.shortAddress}
                                        </Text>
                                    </>
                                )}
                                <Pills />
                            </Flex>
                        </Box>
                        <Spacer y size={4} />
                        <Box display={{ _: "none", t: "block" }}>
                            <GotoLeaderboardPageButton />
                            <Spacer y size={4} />
                            <GotoClaimPageButton />
                        </Box>
                        <Spacer y size={4} />
                        <Box display={{ _: "none", t: "block" }}>
                            <Faqs />
                        </Box>
                    </Aside>
                    <StyledFlex
                        flexDirection="column"
                        columnGap={5}
                        width="100%"
                    >
                        <Flex
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            columnGap={3}
                            py={5}
                            px={3}
                            mt={{ _: 5, t: 0 }}
                            border="1px solid"
                            borderColor="muted"
                        >
                            <ProgressBar
                                percentage={
                                    Math.ceil(
                                        100 *
                                            Math.min(
                                                points?.length || 0,
                                                pointsPerVoucher
                                            )
                                    ) / pointsPerVoucher
                                }
                                width="100%"
                            />
                            <Text
                                variant="bodyBold2"
                                fontSize={{ _: 2, m: 3 }}
                                textAlign="center"
                            >
                                Collect{" "}
                                <b>
                                    {pointsPerVoucher} {pointName}
                                </b>{" "}
                                NFT to receive your <b>FREE</b> Voucher
                            </Text>
                        </Flex>
                        <HomeSwiper
                            ItemComponent={Card}
                            PlaceholderComponent={CardPlaceholder}
                            items={points}
                            title={
                                <Text
                                    variant="bodyBold2"
                                    fontSize={{ _: 4, m: 5 }}
                                    fontWeight="semibold"
                                >
                                    {pointName} Points ({points?.length || 0})
                                </Text>
                            }
                            swiperProps={{
                                slidesPerView: 1,
                                breakpoints: {
                                    447: { slidesPerView: 2 },
                                    767: { slidesPerView: 3 },
                                    1419: { slidesPerView: 5 },
                                },
                            }}
                        />
                        {points != null && points.length >= 10 && (
                            <Button
                                onClick={() => {
                                    setIsOpen(true);
                                }}
                                disabled={isLoading}
                            >
                                Claim Voucher
                            </Button>
                        )}
                        <HomeSwiper
                            ItemComponent={(t: MarketplaceTokenFragment) => (
                                <VoucherCard
                                    onClick={() => {
                                        handleTransfer(t);
                                    }}
                                    {...t}
                                />
                            )}
                            PlaceholderComponent={CardPlaceholder}
                            items={vouchers}
                            title={
                                <Text
                                    variant="bodyBold2"
                                    fontSize={{ _: 4, m: 5 }}
                                    fontWeight="semibold"
                                >
                                    Vouchers Collected ({vouchers?.length || 0})
                                </Text>
                            }
                            swiperProps={{
                                slidesPerView: 1,
                                breakpoints: {
                                    447: { slidesPerView: 2 },
                                    767: { slidesPerView: 3 },
                                    1419: { slidesPerView: 5 },
                                },
                            }}
                        />
                        <Box display={{ _: "block", t: "none" }}>
                            <Faqs />
                        </Box>
                        {pointName === "RAW" ? (
                            <Flex
                                flexDirection={{ _: "column", d: "row" }}
                                rowGap={{ _: 0, d: 5 }}
                                columnGap={{ _: 4, d: 0 }}
                            >
                                <Flex
                                    flexDirection="column"
                                    columnGap={4}
                                    flex={1}
                                >
                                    <Flex alignItems="center" rowGap={3}>
                                        <Text
                                            variant="bodyBold2"
                                            fontSize={{ _: 4, m: 5 }}
                                            fontWeight="semibold"
                                        >
                                            About Scheckter&apos;s RAW
                                        </Text>
                                        <Link
                                            href="https://schecktersraw.com/"
                                            passHref
                                        >
                                            <Text
                                                color="primary"
                                                fontWeight="semibold"
                                                as="a"
                                                // @ts-ignore
                                                target="_blank"
                                            >
                                                Visit website
                                            </Text>
                                        </Link>
                                    </Flex>
                                    <Text>
                                        RAW to us is natural, authentic, honest,
                                        plant-based, cruelty-free and nutrient
                                        dense food. We source our ingredients
                                        only from the best of local and
                                        international suppliers. We strive to
                                        serve beautifully presented, nutritious
                                        food infused with passion, gratitude and
                                        a generous spirit.
                                    </Text>
                                    <Text>
                                        We want to share our passion for
                                        delicious, wholesome food that
                                        nourishes, sustains and inspires people
                                        to lead a happy and health full life.
                                        One healthy meal at a time. We look
                                        forward to welcoming you to the
                                        Scheckter’s RAW experience soon.{" "}
                                    </Text>
                                    <Text>
                                        <Text color="text" as="span">
                                            <b>Location:</b>
                                        </Text>{" "}
                                        98 Regent Road, Sea Point, Cape Town
                                    </Text>
                                </Flex>
                                <div>
                                    <Box
                                        display={{ _: "block", t: "none" }}
                                        mb={5}
                                    >
                                        <GotoLeaderboardPageButton />
                                        <Spacer y size={4} />
                                        <GotoClaimPageButton />
                                    </Box>
                                    <Box
                                        flex={1}
                                        width="100%"
                                        height="100%"
                                        maxWidth={{ _: 500, t: 430 }}
                                        maxHeight={{ _: 500, t: 430 }}
                                    >
                                        <img
                                            src="/img/business_dashboard_raw__map.png"
                                            width="100%"
                                            height="100%"
                                            alt="Map"
                                        />
                                    </Box>
                                </div>
                            </Flex>
                        ) : (
                            <Box display={{ _: "block", t: "none" }} mb={5}>
                                <GotoLeaderboardPageButton />
                                <Spacer y size={4} />
                                <GotoClaimPageButton />
                            </Box>
                        )}
                    </StyledFlex>
                </Flex>
            </Container>
            <Spacer y size={6} />
            <AnimatedModal
                title="Claiming Voucher"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <ModalMintingContent
                    setIsOpen={setIsOpen}
                    onSubmit={handleClaim}
                    alt="Claim 1 FREE Voucher"
                    src={voucherImgUrl}
                />
            </AnimatedModal>
            <WhatsappButton />
        </section>
    );
};

const Container = styled.div`
    ${containerLarge}
`;

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

const Banner = styled(Box)<{ imgMobile: string; imgDesktop: string }>`
    height: 120px;
    background-image: url(${(props) => props.imgMobile});
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
    @media screen and (min-width: ${({ theme }) => theme.breakpoints.t}) {
        margin: 0 auto;
        max-width: 1400px;
        height: 300px;
        background-image: url(${(props) => props.imgDesktop});
        background-position: bottom center;
    }
`;

// See this fucking issue: https://github.com/nolimits4web/swiper/issues/3599
const StyledFlex = styled(Flex)`
    min-width: 0;
`;

const Aside = styled.aside`
    width: 100%;
    @media only screen and (min-width: ${({ theme }) => theme.breakpoints.t}) {
        max-width: 300px;
    }
`;
