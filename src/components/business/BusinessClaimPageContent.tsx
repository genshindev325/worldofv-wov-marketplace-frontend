import { useBlockchain } from "@/blockchain/BlockchainProvider";
import ConnectStep from "@/components/Auth/ConnectStep";
import { useRefresh } from "@/components/RefreshContext";
import usePersistentRedirect from "@/hooks/usePersistentRedirect";
import { useUserData } from "@/hooks/useUserData";
import AnimatedModal from "@/modals/AnimatedModal";
// import { wait } from "@/utils/wait";
import { Card } from "@/components/cards/Card";
import { useTranslation } from "next-i18next";
import { FC, useCallback, useEffect, useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { SlSocialDropbox, SlWallet } from "react-icons/sl";
import styled from "styled-components";
import useSWR from "swr";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import { convertIPFS } from "../../utils/ipfsHelper";
import { Box } from "../common/Box";
import { Button } from "../common/Button";
import { Flex } from "../common/Flex";
import { Spacer } from "../common/Spacer";
import { Text } from "../common/Text";
import { WhatsappButton } from "../common/WhatsappButton";
import FlatLoader from "../FlatLoader";
import Link from "../Link";
import { ModalMintingContent } from "./ModalMintingContent";
import { RegistrationForm, RegistrationFormProps } from "./RegistrationForm";

const { containerLarge } = common;
const { dark } = mixins;

type locales = "en" | "it";

export type BusinessClaimPageContentProps = {
    slug: string;
    pointsContractAddress: string;
    titleStrong?: string;
    nftImgUrl: string;
    nftName: string;
    nftNameStrong?: boolean;
    isSingleClaim?: boolean;
    logoUrlLight?: string;
    logoUrlDark?: string;
    bannerUrlMobile: string;
    bannerUrlDesktop: string;
    showDashboardButton?: boolean;
    loginTitle?: Record<locales, string>;
    locale?: locales;
} & Pick<
    RegistrationFormProps,
    | "clientId"
    | "selectOptions"
    | "optionsLabel"
    | "isPOAToken"
    | "validChars"
    | "codeLength"
    | "showTwitter"
    | "showBirthDate"
>;

export const BusinessClaimPageContent: FC<BusinessClaimPageContentProps> = ({
    slug,
    pointsContractAddress,
    titleStrong = "FREE",
    nftImgUrl,
    nftName,
    nftNameStrong = false,
    isSingleClaim = false,
    logoUrlLight,
    logoUrlDark,
    bannerUrlMobile,
    bannerUrlDesktop,
    clientId,
    codeLength,
    validChars,
    selectOptions,
    optionsLabel,
    isPOAToken = true,
    showDashboardButton = true,
    loginTitle,
    showTwitter,
    showBirthDate,
    locale = "en",
}) => {
    const { t } = useTranslation();

    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [mintModalOpen, setMintModalOpen] = useState(false);
    const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const { user } = useUserData();
    const { nftService } = useBlockchain();
    const refreshPoins = useRefresh("business-dashboard");

    const { setRedirectUrl } = usePersistentRedirect();

    // Keep track of the current url for when using social login redirect
    useEffect(() => {
        setRedirectUrl(`/${locale}/business/claim/${slug}`);
    }, [locale, setRedirectUrl, slug]);

    const { data: mintedCount, error: mintCountError } = useSWR(
        user
            ? [
                  pointsContractAddress,
                  user?.address,
                  nftService,
                  "USER_MINTED_COUNT",
              ]
            : null,
        (...args) => nftService?.getRandomTokenCount(args[0], args[1])
    );

    // We fetch the token image directly from the blockchain since the backend
    // might be too slow to keep up with the volume of mints during an event.
    const fetchToken = useCallback(async () => {
        if (user?.address == null) return;

        try {
            const tokenUri = await nftService?.getLatestMintedTokenUri(
                pointsContractAddress,
                user.address,
                "DynamicNFT"
            );

            if (tokenUri == null) throw new Error("No events found");

            const url = convertIPFS(
                tokenUri,
                process.env.NEXT_PUBLIC_WOV_IPFS_BASE_URL
            );

            const metadata = await fetch(url!);
            const json = await metadata.json();

            const imgUrl = convertIPFS(
                json.image,
                process.env.NEXT_PUBLIC_WOV_IPFS_BASE_URL
            );

            setImageUrl(imgUrl || nftImgUrl);
        } catch (err: any) {
            console.warn(err);
        }
    }, [nftImgUrl, nftService, pointsContractAddress, user?.address]);

    useEffect(() => {
        if (user != null) {
            setLoginModalOpen(false);
        } else {
            setLoginModalOpen(true);
        }
    }, [user]);

    const withLogo = logoUrlDark != null && logoUrlLight != null;

    return (
        <section>
            <Container>
                <Flex
                    flexDirection={{ _: "column", m: "row" }}
                    alignItems="center"
                    justifyContent={{ _: "center", m: "space-around" }}
                    columnGap={{ _: 3, m: 0 }}
                    rowGap={{ _: 0, m: 3, t: 4 }}
                    mb={{ _: 100, m: 100 }}
                    pt={{ _: 5, m: 6 }}
                >
                    <Box width={{ _: 250, m: 375, f: 450 }}>
                        <Text
                            variant="body1"
                            fontSize={{ _: 6, m: 7 }}
                            textAlign="center"
                            flex={1}
                        >
                            {slug === "gigidatome" ? (
                                <span>
                                    {t("business_claim:claim_your")}
                                    <br />
                                    <strong>
                                        &apos;Il Gigante Del Campetto&apos;
                                    </strong>
                                    <br />
                                    di Gigi Datome!
                                </span>
                            ) : (
                                <span>
                                    {t("business_claim:claim_your")}
                                    {titleStrong.length > 0 && (
                                        <>
                                            <br />
                                            <strong>{titleStrong}</strong>
                                        </>
                                    )}
                                    {nftName.length > 0 && (
                                        <>
                                            <br />
                                            {nftNameStrong ? (
                                                <strong>{nftName}</strong>
                                            ) : (
                                                <span>{nftName}</span>
                                            )}
                                        </>
                                    )}
                                </span>
                            )}
                        </Text>
                    </Box>

                    {withLogo && (
                        <BusinessLogo
                            imgLight={logoUrlLight!}
                            imgDark={logoUrlDark!}
                            height={{ _: 70, m: 120 }}
                            width={{ _: 250, s: 350, f: 400 }}
                        />
                    )}
                </Flex>
            </Container>
            <BannerContainer
                imgMobile={bannerUrlMobile}
                imgDesktop={bannerUrlDesktop}
            >
                <Container>
                    <Flex
                        flexDirection={{ _: "column", m: "row" }}
                        columnGap={{ _: 6, m: 0 }}
                        rowGap={{ _: 0, m: 3, t: 4 }}
                        alignItems="center"
                        justifyContent={{ _: "center", m: "space-around" }}
                        height={{ _: 400, m: 350, f: 400 }}
                        borderRadius={5}
                    >
                        <Box position="relative" mt={{ _: 6, m: 0 }}>
                            <NFTBox
                                img={nftImgUrl}
                                position={{ _: "absolute", m: "static" }}
                                top={{ _: -250 }}
                                left={{ _: -250 / 2 }}
                                height={{ _: 250, m: 375, f: 450 }}
                                width={{ _: 250, m: 375, f: 450 }}
                                onClick={() => {
                                    if (
                                        isSingleClaim &&
                                        ((mintedCount != null &&
                                            mintedCount > 0) ||
                                            isSubmitted)
                                    ) {
                                        return;
                                    }

                                    if (user?.address != null) {
                                        setRegistrationModalOpen(true);
                                    } else {
                                        setLoginModalOpen(true);
                                    }
                                }}
                            />
                        </Box>
                        <Box position="relative">
                            <Card
                                position={{ _: "absolute", m: "static" }}
                                left={{
                                    _: -250 / 2,
                                    s: -350 / 2,
                                    f: -400 / 2,
                                }}
                                width={{ _: 250, s: 350, f: 400 }}
                                px={{ _: 3, m: 5 }}
                                py={{ _: 5, m: 5 }}
                            >
                                <Flex
                                    flexDirection="column"
                                    alignItems="center"
                                >
                                    <TitleInfoBox>
                                        <span>
                                            {t("business_claim:claim_your")}
                                            {titleStrong.length > 0 && (
                                                <>
                                                    <br />
                                                    <strong>
                                                        {titleStrong}
                                                    </strong>
                                                </>
                                            )}
                                            {nftName.length > 0 && (
                                                <>
                                                    <br />
                                                    {nftNameStrong ? (
                                                        <strong>
                                                            {nftName}
                                                        </strong>
                                                    ) : (
                                                        <span>{nftName}</span>
                                                    )}
                                                </>
                                            )}
                                        </span>
                                    </TitleInfoBox>
                                    <Spacer y size={3} />
                                    {/* <SubtitleInfoBox>
                                        *{t("business_claim:fees_paid_by")}
                                    </SubtitleInfoBox> */}
                                    {!user ? (
                                        <Button
                                            fullWidth
                                            onClick={() => {
                                                setLoginModalOpen(true);
                                            }}
                                        >
                                            {t(
                                                "business_claim:connect_button_label"
                                            )}
                                        </Button>
                                    ) : mintedCount == null ? (
                                        <FlatLoader
                                            size={48}
                                            style={{ margin: "auto" }}
                                        />
                                    ) : isSingleClaim &&
                                      (mintedCount > 0 || isSubmitted) ? (
                                        <Text variant="body2" color="primary">
                                            {t(
                                                "business_claim:single_mint_message"
                                            )}
                                        </Text>
                                    ) : user?.address != null ? (
                                        <Button
                                            fullWidth
                                            onClick={() => {
                                                setRegistrationModalOpen(true);
                                            }}
                                        >
                                            {t(
                                                "business_claim:claim_button_label"
                                            )}
                                        </Button>
                                    ) : (
                                        <Link href={"/login"} passHref>
                                            <Button fullWidth>
                                                {t(
                                                    "business_claim:connect_button_label"
                                                )}
                                            </Button>
                                        </Link>
                                    )}
                                    <Spacer y size={3} />
                                    {showDashboardButton ? (
                                        <Link
                                            href={`/business/dashboard/${slug}`}
                                            passHref
                                        >
                                            <Button
                                                impact
                                                fullWidth
                                                disabled={!mintedCount}
                                            >
                                                {t(
                                                    "business_claim:goto_dashboard_button_label"
                                                )}
                                            </Button>
                                        </Link>
                                    ) : mintedCount != null &&
                                      mintedCount > 0 ? (
                                        <Link
                                            href={`/profile/${user?.address}`}
                                            passHref
                                        >
                                            <Button impact fullWidth>
                                                {t(
                                                    "business_claim:goto_profile_button_label"
                                                )}
                                            </Button>
                                        </Link>
                                    ) : null}
                                </Flex>
                            </Card>
                        </Box>
                    </Flex>
                </Container>
            </BannerContainer>
            <Container style={{ padding: 0 }}>
                <Flex
                    flexDirection={{ _: "column", m: "row" }}
                    flexWrap="wrap"
                    alignItems={{ _: "center", m: "flex-start" }}
                    justifyContent="center"
                    pt={{ _: 180, m: 7 }}
                    pb={{ _: 5, m: 7 }}
                >
                    <Blurp>
                        <SlWallet size={50} />
                        <BlurpText>
                            {t("business_claim:tutorial.step_one.line_one")}{" "}
                            <Text
                                as="a"
                                onClick={() => {
                                    setLoginModalOpen(true);
                                }}
                                whiteSpace="nowrap"
                            >
                                {t("business_claim:tutorial.step_one.line_two")}{" "}
                            </Text>
                            {t("business_claim:tutorial.step_one.line_three")}{" "}
                            <a
                                href="https://www.veworld.net/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                VeChain
                            </a>{" "}
                            {t("business_claim:tutorial.step_one.line_four")}
                        </BlurpText>
                    </Blurp>
                    <Blurp>
                        <FiEdit size={50} />
                        <BlurpText>
                            {t("business_claim:tutorial.step_two")}
                        </BlurpText>
                    </Blurp>
                    <Blurp>
                        <AiOutlineCheckCircle size={50} />
                        <BlurpText>
                            {t("business_claim:tutorial.step_three")}
                        </BlurpText>
                    </Blurp>
                    <Blurp>
                        <SlSocialDropbox size={50} />
                        <BlurpText>
                            {t("business_claim:tutorial.step_four.line_one")}{" "}
                            <Link
                                href={
                                    user?.address
                                        ? `/profile/${user.address}?tab=collected`
                                        : "/login"
                                }
                                passHref
                            >
                                {t(
                                    "business_claim:tutorial.step_four.line_two"
                                )}
                            </Link>
                            !
                        </BlurpText>
                    </Blurp>
                </Flex>
            </Container>

            <AnimatedModal
                title={`${t("business_claim:claim_your")} ${nftName}`}
                isOpen={registrationModalOpen}
                setIsOpen={setRegistrationModalOpen}
            >
                <RegistrationForm
                    pointsContractAddress={pointsContractAddress}
                    clientId={clientId}
                    codeLength={codeLength}
                    validChars={validChars}
                    selectOptions={selectOptions}
                    optionsLabel={optionsLabel}
                    showTwitter={showTwitter}
                    showBirthDate={showBirthDate}
                    onSubmit={(data) => {
                        setRegistrationModalOpen(false);
                        setMintModalOpen(true);
                    }}
                />
            </AnimatedModal>

            <AnimatedModal
                title={`Your ${nftName}`}
                isOpen={mintModalOpen}
                setIsOpen={(v) => {
                    if (isSubmitted) setMintModalOpen(v);
                }}
            >
                <ModalMintingContent
                    setIsOpen={setMintModalOpen}
                    onSubmit={async () => {
                        setIsSubmitted(true);

                        if (isPOAToken) {
                            setImageUrl(nftImgUrl);
                            // await wait(10_000);
                        } else {
                            await fetchToken();
                        }
                        await refreshPoins();
                    }}
                    alt={`Claim 1 FREE ${nftName}`}
                    src={imageUrl}
                    RedirectButton={
                        showDashboardButton
                            ? () => (
                                  <Link
                                      href={`/business/dashboard/${slug}`}
                                      passHref
                                  >
                                      <StyledButton>
                                          {t(
                                              "business_claim:goto_dashboard_button_label"
                                          )}
                                      </StyledButton>
                                  </Link>
                              )
                            : undefined
                    }
                />
            </AnimatedModal>
            <WhatsappButton />
            <AnimatedModal
                title=""
                isOpen={loginModalOpen}
                setIsOpen={setLoginModalOpen}
            >
                <Flex
                    flexDirection="column"
                    flex={1}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text
                        variant="bodyBold2"
                        fontSize={{ _: 5, a: 6 }}
                        textAlign="center"
                        px={{ _: 0, a: 5 }}
                        dangerouslySetInnerHTML={{
                            __html:
                                (loginTitle != null &&
                                    (loginTitle[locale] || loginTitle["en"])) ||
                                t("business_claim:login_modal.title"),
                        }}
                    />

                    <Spacer y size={2} />

                    <Text
                        variant="bodyBold2"
                        color="neutral"
                        textAlign="center"
                        fontSize={{ _: 4, a: 5 }}
                    >
                        {t("business_claim:login_modal.subtitle")}
                    </Text>

                    <Spacer y size={5} />

                    <ConnectStep socialsFirst />
                </Flex>
            </AnimatedModal>
        </section>
    );
};

const Container = styled(Box)`
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

const BannerContainer = styled.div<{ imgMobile: string; imgDesktop: string }>`
    background-image: url(${(props) => props.imgMobile});
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
    @media screen and (min-width: ${({ theme }) => theme.breakpoints.m}) {
        background-image: url(${(props) => props.imgDesktop});
        background-position: bottom center;
    }
`;

const NFTBox = styled(Box)<{ img: string }>`
    background-image: url(${(props) => props.img});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    border-radius: 30px;
    box-shadow: 0 0 8px 1px ${({ theme }) => theme.colors.neutral};
`;

const TitleInfoBox = styled.div`
    ${({ theme }) => theme.typography.body1}
    padding-bottom: 3px;
    width: 100%;
    text-align: center;
    @media screen and (max-width: ${({ theme }) => theme.breakpoints.a}) {
        font-size: 20px;
        text-align: center;
    }
`;

const SubtitleInfoBox = styled.p`
    font-style: italic;
    padding-bottom: 22px;
`;

const Blurp = styled.div`
    flex-basis: 120px;
    @media screen and (min-width: ${({ theme }) => theme.breakpoints.m}) {
        flex-basis: 300px;
    }
    width: 100%;
    max-width: 300px;
    text-align: center;
    margin: ${({ theme }) => `${theme.space[4]}px ${theme.space[2]}px`};
    @media screen and (min-width: ${({ theme }) => theme.breakpoints.m}) {
        margin: ${({ theme }) => theme.space[4]}px;
    }
    a {
        font-weight: 700;
        color: var(--color-primary-dark-10);
        &:hover {
            color: var(--color-primary);
        }
    }
`;

const BlurpText = styled.p`
    margin-top: 20px;
    span {
        color: ${({ theme }) => theme.colors.primaryDark10};
        font-weight: bold;
    }
`;

const StyledButton = styled(Button)`
    margin: 20px 35px;
    width: 80%;
`;
