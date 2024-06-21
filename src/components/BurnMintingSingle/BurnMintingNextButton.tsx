import { useContext } from "react";
import styled from "styled-components";
import { TokenBatchSelectContext } from "../../providers/BatchSelectProvider";
import { Button } from "../common/Button";
import { BurnMintingContext } from "./BurnMintingContext";

export default function BurnMintingNextButton() {
    const {
        selectedItems,
        maxSelectedCount,
        minSelectedCount,
        submit,
        submitLabel,
    } = useContext(TokenBatchSelectContext);

    const { currentStep } = useContext(BurnMintingContext);

    if (currentStep > 0) return null;

    return (
        <Container>
            <Button
                disabled={selectedItems.size < minSelectedCount}
                fullWidth
                onClick={submit}
            >
                {submitLabel} ({selectedItems.size} / {maxSelectedCount}{" "}
                selected)
            </Button>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    max-width: ${({ theme }) => theme.breakpoints.f};

    > * + * {
        margin-top: 8px;
    }
`;
