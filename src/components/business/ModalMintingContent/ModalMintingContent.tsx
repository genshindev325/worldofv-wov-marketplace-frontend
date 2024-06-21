import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { Button } from "../../common/Button";
import { Flex } from "../../common/Flex";
import { Spacer } from "../../common/Spacer";
import FlatLoader from "../../FlatLoader";

export interface ModalMintingContentProps {
    setIsOpen: (newState: boolean) => void;
    onSubmit: () => Promise<void>;
    alt: string;
    src: string | null | undefined;
    RedirectButton?: () => JSX.Element;
}

const CONFETTI_ROUNDS = 5;
const CONFETTI_DURATION = 1500;

export const ModalMintingContent: React.FC<ModalMintingContentProps> = ({
    setIsOpen,
    onSubmit,
    alt,
    src,
    RedirectButton,
}) => {
    const { t } = useTranslation();

    const [isLoading, setLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);
    const [confettiRound, setConfettiRound] = React.useState(0);

    const submit = useCallback(async () => {
        try {
            setHasError(false);
            await onSubmit();
        } catch (error: any) {
            console.warn(error.message || error);
            setHasError(error.message || error);
        } finally {
            setLoading(false);
        }
    }, [onSubmit]);

    useEffect(() => {
        submit();
    }, []);

    React.useEffect(() => {
        if (isLoading || hasError) return;

        const interval = setInterval(() => {
            setConfettiRound((confettiRound) => {
                if (confettiRound < CONFETTI_ROUNDS) confettiRound++;
                return confettiRound;
            });
        }, CONFETTI_DURATION);

        return () => {
            clearInterval(interval);
        };
    }, [isLoading, hasError]);

    if (!hasError) {
        return (
            <Container>
                {isLoading || src == null ? (
                    <Flex
                        flexDirection="column"
                        alignItems="center"
                        columnGap={5}
                        mt={5}
                    >
                        <FlatLoader size={150} />
                        <SubTitle>
                            {t("business_claim:minting_modal.title")}
                        </SubTitle>
                        <Text>
                            {t("business_claim:minting_modal.subtitle")}
                        </Text>
                    </Flex>
                ) : (
                    <>
                        <CardAsset>
                            <img src={src} alt={alt} />
                        </CardAsset>
                        <SubTitle>
                            {" "}
                            {t("business_claim:minting_modal.success_message")}
                        </SubTitle>
                        {RedirectButton != null && <RedirectButton />}
                    </>
                )}
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
            </Container>
        );
    }
    return (
        <Container>
            <FaTimes color={"red"} size={150} />
            <SubTitle>Something Went Wrong...</SubTitle>
            <Text>Message: {hasError}</Text>
            <Spacer size={50} y />
            <Button onClick={() => setIsOpen(false)}>Close</Button>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SubTitle = styled.div`
    text-align: center;
    ${({ theme }) => theme.typography.bodyBold1};
    margin: 20px 0;
`;

const Text = styled.div`
    margin: 0 20px;
    ${({ theme }) => theme.typography.caption2};
    text-align: center;
    a {
        color: var(--color-primary-dark-10);
        &:hover {
            color: var(--color-primary);
        }
    }
`;

const SmallText = styled.div`
    margin: 20px;
    font-size: 12px;
    text-align: center;
    font-weight: bolder;
    a {
        color: var(--color-primary-dark-10);
        &:hover {
            color: var(--color-primary);
        }
    }
`;

const CardAsset = styled.div`
    overflow: hidden;
    border-radius: 16px;
    max-height: 400px;
    max-width: 400px;
    margin: auto;

    img,
    video,
    div {
        object-fit: cover;
        width: 100%;
        height: 100%;
        max-height: 400px;
        transition: transform 1s;
        background-color: var(--color-muted);
    }
`;
