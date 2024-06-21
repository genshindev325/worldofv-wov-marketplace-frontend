import { darken, rgba } from "polished";
import React from "react";
import styled from "styled-components";
import mixins from "../../../styles/_mixins";
import variables from "../../../styles/_variables";
import Icon from "../../Icon";

const { media, dark } = mixins;
const {
    colors: { red, yellow, blue, green },
    typography: { bodyBold2, caption2 },
} = variables;

interface AlertProps {
    title?: string;
    text?: string | any;
    className?: string;
    style?: React.CSSProperties;
    variant?: "info" | "warn" | "error" | "success";
    small?: boolean;
    center?: boolean;
    noIcon?: boolean;
}

const VARIANT_COLOR = {
    info: blue,
    warn: yellow,
    error: red,
    success: green,
};

export const Alert: React.FC<AlertProps> = ({
    title,
    text,
    style,
    className,
    variant = "error",
    small,
    center,
    noIcon,
}) => (
    <Container
        {...{ style, className, small, center, color: VARIANT_COLOR[variant] }}
    >
        {!noIcon && (
            <IconContainer {...{ small }}>
                <Icon icon="info-circle" size={small ? 16 : 32} />
            </IconContainer>
        )}

        <Details {...{ center }}>
            {title && <Title>{title}</Title>}
            {text && <Text>{text}</Text>}
        </Details>
    </Container>
);

const Container = styled.div<{
    color: string;
    small?: boolean;
    center?: boolean;
}>`
    display: flex;
    align-items: center;
    padding: ${({ small }) => (small ? "8px" : "24px")};
    border-radius: 8px;
    background: ${(props) => rgba(props.color, 0.08)};
    color: ${(props) => darken(0.2, props.color)};

    ${dark`
        color: ${(props: any) => props.color};
    `}
`;

const IconContainer = styled.div<{ small?: boolean }>`
    flex-shrink: 0;
    width: ${({ small }) => (small ? "16px" : "32px")};
    margin-right: ${({ small }) => (small ? "8px" : "16px")};

    .icon {
        width: ${({ small }) => (small ? "16px" : "32px")};
        height: ${({ small }) => (small ? "16px" : "32px")};
        fill: ${red};
    }

    ${media.s`
        display: none;
        margin-top: 4px;
        width: 24px;

        .icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
        }
    `}
`;

const Details = styled.div<{ center?: boolean }>`
    flex-grow: 1;
    text-align: ${({ center }) => (center ? "center" : "left")};
`;

const Title = styled.div`
    ${bodyBold2};
`;

const Text = styled.div`
    ${caption2};

    a {
        color: inherit !important;
        font-weight: bold;
        text-decoration: underline;

        :hover {
            filter: brightness(125%);
        }
    }
`;
