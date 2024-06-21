import { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { Alert } from "../components/common/Alert";
import { Button } from "../components/common/Button";
import { useConnex } from "../components/ConnexProvider";
import FlatLoader from "../components/FlatLoader";
import { useItem } from "../components/ProductDetail/ProductDetailProvider";
import StakingDetails from "../components/StakingDetails";
import variables from "../styles/_variables";
import AnimatedModal, { AnimatedModalProps } from "./AnimatedModal";

const { colors, typography } = variables;
const { neutrals } = colors;

export type ModalStakeProps = Pick<AnimatedModalProps, "isOpen" | "setIsOpen">;

export default function ModalStake(props: ModalStakeProps) {
    return (
        <AnimatedModal
            small
            title="Stake"
            transitionProps={{ mountOnEnter: false }}
            {...props}
        >
            <ModalContent {...props} />
        </AnimatedModal>
    );
}

function ModalContent({ setIsOpen }: ModalStakeProps) {
    const [isLoading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { token, mutateEditions, mutateOffers, selectedEdition } = useItem();
    const { stake, getStakingInfo, checkTransaction } = useConnex();

    const { data: details, error: connexError } = useSWR(
        token.collection.stakingContractAddresses?.[0],
        getStakingInfo
    );

    const hasStarted = details
        ? details.periodFinish >= Date.now() / 1000
        : false;

    const onSubmit = async () => {
        if (!hasStarted) {
            return;
        }

        try {
            setLoading(true);
            setHasError(false);

            const tx = await stake({
                stakingContractAddress:
                    token.collection.stakingContractAddresses?.[0],
                tokenId: token.id,
                smartContractAddress: token.smartContractAddress,
                saleId: selectedEdition.saleId,
            });

            await checkTransaction({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: "Ticket",
                clauseIndex: tx.clauseCount - 1,
                TIMEOUT: tx.clauseCount * 2000 + 30000,
                toast: {
                    enabled: true,
                    success: "Your token has been staked!",
                },
            });

            await mutateEditions();
            await mutateOffers();

            setIsOpen(false);
        } catch (error: any) {
            console.warn(error.message || error);
            setHasError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            {connexError ? (
                <Alert title="An error occured." />
            ) : !details ? (
                <FlatLoader size={32} style={{ margin: "auto" }} />
            ) : (
                <>
                    <StakingDetails {...details} />

                    <ConfirmButton
                        onClick={onSubmit}
                        loader={!connexError && (isLoading || !details)}
                        disabled={connexError || !hasStarted}
                    >
                        {hasError ? "Retry" : "Stake"}
                    </ConfirmButton>
                </>
            )}
        </Container>
    );
}

const Container = styled.div`
    ${typography.body2}
    display: flex;
    flex-direction: column;
    margin-top: -32px;

    > * + * {
        margin-top: 32px;
    }
`;

const ConfirmButton = styled(Button)`
    width: 100%;
`;
