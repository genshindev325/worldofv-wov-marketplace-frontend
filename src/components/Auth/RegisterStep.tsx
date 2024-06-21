import { useBlockchain } from "@/blockchain/BlockchainProvider";
import usePersistentRedirect from "@/hooks/usePersistentRedirect";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import variables from "../../styles/_variables";
import { Button } from "../common/Button";

const {
    colors: { neutrals },
    typography: { h4, caption2 },
} = variables;

const RegisterStep: React.FC<{}> = () => {
    const router = useRouter();
    const { walletService } = useBlockchain();

    const { redirectToLastSavedUrl } = usePersistentRedirect();

    return (
        <Container>
            <Head>
                <div>
                    <Title>This address is not linked to any account</Title>

                    <Description>
                        Join now the first green, zero-cost NFT platform
                        focusing on Art built on the VeChain blockchain!
                    </Description>
                </div>
            </Head>

            <div>
                <ButtonGroup>
                    <Button outline onClick={() => walletService!.logout()}>
                        Switch address
                    </Button>

                    <Button onClick={() => router.push("profile/edit")}>
                        Join now
                    </Button>

                    <Button onClick={() => redirectToLastSavedUrl()}>
                        Not now
                    </Button>
                </ButtonGroup>
            </div>
        </Container>
    );
};

const Container = styled.div`
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    max-width: 600px;
`;

const Head = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 32px;

    > div {
        max-width: 380px;
    }
`;

const Title = styled.h3`
    ${h4};
    margin-bottom: 12px;
    text-align: center;
`;

const Description = styled.div`
    text-align: center;
    ${caption2};
    color: ${neutrals[4]};
`;

const ButtonGroup = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    > * {
        &:not(:first-child) {
            margin-left: 16px;
        }
    }
`;

export default RegisterStep;
