import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { Modal } from "./Modal";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Modal",
    component: Modal,
    argTypes: {},
} as ComponentMeta<typeof Modal>;

export const Default: ComponentStory<typeof Modal> = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => {
                    setOpen(true);
                }}
            >
                Open modal
            </button>
            <Modal
                label="I'm the label"
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <p>I&apos;m the child</p>
            </Modal>
        </>
    );
};
