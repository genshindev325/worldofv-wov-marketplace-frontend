import { useUserData } from "@/hooks/useUserData";
import React from "react";
import styled from "styled-components";
import PillsNav, { NavItemProps } from "../components/PillsNav";
import { useItem } from "../components/ProductDetail/ProductDetailProvider";
import SelectedEdition from "../components/SelectEditionModal/SelectedEdition";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { EditionData } from "../types/EditionData";
import AnimatedModal from "./AnimatedModal";

const { media, dark } = mixins;
const {
    colors: { neutrals },
    typography: { hairline2, captionBold1, bodyBold2 },
} = variables;

interface ModalSelectEditionProps {
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void;
    onSelect: (edition: EditionData) => void;
}

const ModalSelectEdition: React.FC<ModalSelectEditionProps> = ({
    isOpen,
    setIsOpen,
    onSelect,
}) => {
    const { user } = useUserData();
    const { token } = useItem();

    const [selectedTab, setSelectedTab] = React.useState("All Editions");

    const [editionsToRender, setEditionsToRender] = React.useState(
        token.editions
    );

    const ownedEditions = React.useMemo(
        () => (user ? token.getEditionsOwnedBy(user.address) : []),
        [token, user]
    );

    React.useEffect(() => {
        switch (selectedTab) {
            case "All Editions":
                setEditionsToRender(token.editions);
                break;
            case "On Sale":
                setEditionsToRender(token.editionsOnSale);
                break;
            case "Owned":
                setEditionsToRender(ownedEditions);
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTab, token]);

    const navList = [
        {
            label: "All Editions",
            count: token.editions.length,
        },
        {
            label: "On Sale",
            count: token.editionsOnSale.length,
        },
        {
            label: "Owned",
            count: ownedEditions.length,
        },
    ];

    const onTabChange = (item: NavItemProps) => setSelectedTab(item.label);

    return (
        <AnimatedModal title="Select edition" {...{ isOpen, setIsOpen }}>
            <PillsNav
                items={navList}
                defaultSelected="All Editions"
                onChange={onTabChange}
                style={{ marginBottom: 8 }}
            />

            <EditionsTable>
                <EditionsTableHead>
                    <EditionsTableColumnEdition>
                        Edition
                    </EditionsTableColumnEdition>

                    <EditionsTableColumnOwner>Owner</EditionsTableColumnOwner>

                    <EditionsTableColumnPrice>Price</EditionsTableColumnPrice>

                    <EditionsTableColumnSelect />
                </EditionsTableHead>

                {editionsToRender?.length ? (
                    editionsToRender.map((edition) => (
                        <SelectedEdition
                            edition={edition}
                            onSelect={onSelect}
                            key={edition.editionNumber}
                        />
                    ))
                ) : (
                    <NoEditionsText>No editions found</NoEditionsText>
                )}
            </EditionsTable>
        </AnimatedModal>
    );
};

const NoEditionsText = styled.div`
    text-align: center;
    margin-top: 16px;
    ${bodyBold2};
`;

const EditionsTable = styled.div`
    display: flex;
    flex-direction: column;
    color: ${neutrals[3]};
    padding-top: 16px;

    ${dark`
        color: ${neutrals[4]};
    `}
`;

const EditionsTableColumnEdition = styled.div`
    flex-basis: 20%;

    ${media.a`
        flex-basis: 25%;
    `}
`;

const EditionsTableColumnOwner = styled.div`
    display: flex;
    flex-basis: 30%;

    ${media.a`
        display: none;
    `}

    > * {
        padding: 0;
    }
`;

const EditionsTableColumnPrice = styled.div`
    flex-basis: 30%;

    ${media.a`
        flex-basis: 40%;
    `}
`;

const EditionsTableColumnSelect = styled.div`
    text-align: right;
    flex-basis: 20%;

    ${media.a`
        flex-basis: 35%;
    `}
`;

const EditionsTableHead = styled.div`
    display: flex;
    flex-direction: row;
    padding-bottom: 16px;
    color: ${neutrals[5]};
    border-bottom: 1px solid ${neutrals[6]};
    ${hairline2};

    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

export default ModalSelectEdition;
