import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useContext } from "react";
import {
    BatchSelectProvider,
    TokenBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import { BatchSelectToolbar } from "./BatchSelectToolbar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/batch-actions/BatchSelectToolbar",
    component: BatchSelectToolbar,
    argTypes: {},
} as ComponentMeta<typeof BatchSelectToolbar>;

const Child = () => {
    const { setSelecting } = useContext(TokenBatchSelectContext);

    return (
        <>
            <header>I&apos;m the header</header>
            <button
                onClick={() => {
                    setSelecting(true);
                }}
            >
                Open Toolbar
            </button>
            <BatchSelectToolbar
                selectionContext={TokenBatchSelectContext}
                items={[]}
            />
        </>
    );
};

export const Default: ComponentStory<typeof BatchSelectToolbar> = () => (
    <BatchSelectProvider
        context={TokenBatchSelectContext}
        getId={(t) => t.tokenId}
    >
        <Child />
    </BatchSelectProvider>
);
