import { Flex } from "@/components/common/Flex";
import { useContext, useEffect } from "react";
import styled from "styled-components";
import { MarketplaceTokenFragment } from "../../generated/graphql";
import { TokenBatchSelectContext } from "../../providers/BatchSelectProvider";
import variables from "../../styles/_variables";
import FadeTransition from "../FadeTransition";
import Steps from "../Steps";
import { BurnMintingContext } from "./BurnMintingContext";
import BurnMintingRecap from "./BurnMintingRecap";
import BurnMintingSelect from "./BurnMintingSelect";

const { breakpoints } = variables;

const COMPONENTS = [BurnMintingSelect, BurnMintingRecap];

const STEPS = [{ label: "Select NFT" }, { label: "Try your luck" }];

const validateToBurn = (token: MarketplaceTokenFragment) => {
    if (token.editionsOnSale === 1) {
        return "This NFT is on sale.";
    }

    if (token.editions[0].stakingContractAddress) {
        return "This NFT is on stake.";
    }

    if (
        token.editions[0].cooldownEnd &&
        token.editions[0].cooldownEnd > Date.now() / 1000
    ) {
        return "This NFT is on Cooldown.";
    }
};

export default function BurnMintingContent() {
    const { setSelectionTarget } = useContext(TokenBatchSelectContext);
    const { currentStep, setCurrentStep, isSubmitted } =
        useContext(BurnMintingContext);

    // Set the only selectionTarget on mount
    useEffect(
        () => {
            setSelectionTarget({
                submitLabel: "Next",
                onSubmit: () => setCurrentStep(1),
                validate: validateToBurn,
                maxSelectedCount: 1,
            });
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return (
        <Flex flexDirection="column" columnGap={5} width="100%">
            <StyledSteps
                steps={STEPS}
                value={currentStep}
                onChange={setCurrentStep}
                completed={isSubmitted}
                disabled={isSubmitted}
                wrapWidth={breakpoints.a}
            />

            <FadeTransition
                components={COMPONENTS}
                selectedIndex={currentStep}
            />
        </Flex>
    );
}

const StyledSteps = styled(Steps)`
    width: 100%;
    max-width: ${breakpoints.f};
    margin: auto;
`;
