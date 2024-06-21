import { PropsWithChildren } from "react";
import styled from "styled-components";
import variables from "../styles/_variables";
import { Popup } from "./common/Popup";
import Icon from "./Icon";

export default function InfoPopup({ children }: PropsWithChildren<{}>) {
    return (
        <Popup
            content={<PopupContent>{children}</PopupContent>}
            trigger="mouseenter click"
        >
            <Icon
                icon="info-circle"
                style={{ marginLeft: "4px", marginBottom: "2px" }}
                color={variables.colors.blueLight}
                size={16}
            />
        </Popup>
    );
}

const PopupContent = styled.p`
    padding: 8px;
`;
