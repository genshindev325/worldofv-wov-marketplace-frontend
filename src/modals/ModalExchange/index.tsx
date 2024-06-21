import { Box } from "@/components/common/Box";
import PillsNav, { NavItemProps } from "@/components/PillsNav";
import { useMemo, useState } from "react";
import CircleButton from "../../components/CircleButton";
import { Tooltip } from "../../components/common/Tooltip";
import Icon from "../../components/Icon";
import AnimatedModal from "../AnimatedModal";
import TabTransfer from "./TabTransfer";
import TabWrapUnwrap from "./TabWrapUnwrap";

const TABS = [
    { id: "exchange", label: "Wrap/Unwrap VET" },
    { id: "transfer", label: "Transfer" },
];

export default function ModalExchange() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTabId, setSelectedTabId] = useState(TABS[0].id);

    const selectedTab = useMemo(
        () => TABS.find((t) => t.id === selectedTabId)!,
        [selectedTabId]
    );

    const description = useMemo(() => {
        switch (selectedTabId) {
            case "exchange":
                return "Convert your VET to vVET (Veiled VET) to make leveraged standard/global offers on World of V.";
            case "transfer":
                return "Transfer your funds to a recipient (VeChain address compatible).";
        }
    }, [selectedTabId]);

    return (
        <>
            <Tooltip
                content="Wrap/unwrap & Transfer your tokens"
                placement="bottom"
                bg="silver"
                borderColor="silver"
                color="white"
                width={256}
            >
                <CircleButton
                    small
                    outline
                    style={{ zIndex: 1 }}
                    onClick={() => setIsOpen(true)}
                    ui
                    button
                >
                    <Icon icon="wallet" />
                </CircleButton>
            </Tooltip>

            <AnimatedModal
                small
                transitionProps={{ mountOnEnter: false }}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title={selectedTab.label}
                info={description}
            >
                <PillsNav
                    items={TABS}
                    value={selectedTab.label}
                    onChange={({ id }: NavItemProps) => setSelectedTabId(id!)}
                />

                <Box mb={4} />

                {selectedTabId === "exchange" && (
                    <TabWrapUnwrap setIsOpen={setIsOpen} />
                )}

                {selectedTabId === "transfer" && (
                    <TabTransfer setIsOpen={setIsOpen} />
                )}
            </AnimatedModal>
        </>
    );
}
