import { FC, Fragment, ReactElement } from "react";
import styled from "styled-components";
import Link from "../../Link";
import { Divider } from "../Divider";
import { Flex } from "../Flex";
import { Spacer } from "../Spacer";
import { Text } from "../Text";

export interface PopupLinkItem {
    label?: string;
    Icon?: () => ReactElement;
    href?: string;
    passHref?: boolean;
    target?: any;
    Comp?: FC<any>;
    onClick?: () => void;
}

interface PopupLinkItemsProps {
    items: PopupLinkItem[];
    rounded?: boolean;
}

// TODO: target="_blank" not working
// TODO: improve type def: it should either be Comp or onClick or other
export const PopupLinkItems: FC<PopupLinkItemsProps> = ({
    items,
    rounded = false,
}) => (
    <Flex
        flexDirection="column"
        bg="highlight"
        px={3}
        borderRadius={rounded ? 3 : 0}
    >
        {items.map(
            ({ label, Icon, href, passHref, target, Comp, onClick }, index) => {
                const Wrapper =
                    onClick != null ? (p: any) => <a {...p} /> : Link;

                let props = {};
                if (onClick != null) {
                    props = { onClick };
                } else if (Comp == null) {
                    props = { href, passHref, target };
                }

                return (
                    <Fragment key={index}>
                        <Wrapper {...props}>
                            <StyledFlex py={3}>
                                {Icon != null && (
                                    <>
                                        <Icon />
                                        <Spacer size={2} />
                                    </>
                                )}
                                {label != null && (
                                    <Text
                                        variant="h3"
                                        fontSize={3}
                                        style={{ flexGrow: 1 }}
                                    >
                                        {label}
                                    </Text>
                                )}
                                {Comp != null && <Comp />}
                            </StyledFlex>
                        </Wrapper>
                        {index != items.length - 1 && <Divider />}
                    </Fragment>
                );
            }
        )}
    </Flex>
);

const StyledFlex = styled(Flex)`
    color: ${({ theme }) => theme.colors.accent};
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;
