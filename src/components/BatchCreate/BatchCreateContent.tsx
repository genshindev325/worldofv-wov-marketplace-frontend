import { useContext, useMemo } from "react";
import { useTheme } from "styled-components";
import { Flex } from "../common/Flex";
import FadeTransition from "../FadeTransition";
import Steps from "../Steps";
import { BatchCreateContext } from "./BatchCreateContext";
import BatchCreateInfo from "./BatchCreateInfo";
import BatchCreateSubmit from "./BatchCreateSubmit";
import BatchCreateTable from "./BatchCreateTable";
import BatchCreateUpload from "./BatchCreateUpload";

const STEPS = [
    { label: "Select Files" },
    { label: "Input Info" },
    { label: "Select a Collection" },
    { label: "Create NFTs" },
];

const COMPONENTS = [
    BatchCreateUpload,
    BatchCreateTable,
    BatchCreateInfo,
    BatchCreateSubmit,
];

export default function BatchCreateContent() {
    const theme = useTheme();
    const { currentStep, setCurrentStep } = useContext(BatchCreateContext);

    const step = useMemo(
        () => Math.min(STEPS.length - 1, currentStep),
        [currentStep]
    );

    return (
        <Flex flexDirection="column" columnGap={4}>
            <Steps
                steps={STEPS}
                value={currentStep}
                onChange={setCurrentStep}
                disabled={currentStep >= STEPS.length - 1}
                wrapWidth={theme.breakpoints.m}
            />
            <FadeTransition components={COMPONENTS} selectedIndex={step} />
        </Flex>
    );
}
