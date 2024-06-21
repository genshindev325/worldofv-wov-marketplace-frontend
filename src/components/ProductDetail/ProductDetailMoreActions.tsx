import { useMediaQuery } from "@react-hook/media-query";
import { FC, useMemo } from "react";
import { useTheme } from "styled-components";
import { EditionData } from "../../types/EditionData";
import { ITokenData } from "../../types/TokenData";
import { isSameAddress } from "../../utils/isSameAddress";
import CircleButton from "../CircleButton";
import { Flex } from "../common/Flex";
import { Popup } from "../common/Popup";
import { PopupLinkItems } from "../common/PopupLinkItems";
import { Text } from "../common/Text";
import { Tooltip } from "../common/Tooltip";
import IconComp from "../Icon";

interface ProductDetailMoreActionsProps {
    onBurn?: () => void;
    onTransfer?: () => void;
    onShare?: () => void;
    onViewOriginal?: () => void;
    token: ITokenData;
    canPerformPurchase: any;
    selectedEdition: EditionData;
    userAddress?: string;
}

export const ProductDetailMoreActions: FC<ProductDetailMoreActionsProps> = ({
    onBurn = () => {},
    onTransfer = () => {},
    onShare = () => {},
    onViewOriginal = () => {},
    token,
    canPerformPurchase,
    selectedEdition,
    userAddress,
}) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.m})`);

    const isOwner = isSameAddress(userAddress, selectedEdition?.owner.address);
    const isOnSale = selectedEdition?.isOnSale || false;
    const isStaked = selectedEdition?.stakingContractAddress != null;
    const isOnCooldown = useMemo(
        () => (selectedEdition?.cooldownEnd || 0) > Date.now() / 1000,
        [selectedEdition]
    );

    const originalUrl = token.assets.find(
        (asset) => asset.size === "ORIGINAL"
    )?.url;

    // Calculate Popup items based on state
    const items = [];

    if (isOwner && canPerformPurchase && !isOnCooldown) {
        items.push({
            label: "Transfer token",
            Icon: () => <IconComp icon="arrow-right-square" />,
            onClick: onTransfer,
        });
    }

    items.push({
        label: "Copy link",
        Icon: () => <IconComp icon="link" />,
        onClick: onShare,
    });

    if (originalUrl != null) {
        items.push({
            label: "View original",
            Icon: () => <IconComp icon="full-screen" />,
            onClick: onViewOriginal,
        });
    }

    if (isOwner && canPerformPurchase && !isStaked) {
        const label = "Burn token";
        const Icon = () => <IconComp icon="close-circle" />;

        items.push(
            isOnSale
                ? {
                      Comp: () => (
                          <Tooltip content="This NFT is listed">
                              <a style={{ color: theme.colors.accent }}>
                                  <Flex alignItems="center" rowGap={2}>
                                      <Icon />
                                      <Text
                                          variant="h3"
                                          fontSize={3}
                                          style={{ flexGrow: 1 }}
                                      >
                                          {label}
                                      </Text>
                                  </Flex>
                              </a>
                          </Tooltip>
                      ),
                  }
                : {
                      label,
                      Icon,
                      onClick: onBurn,
                  }
        );
    }

    return (
        <Popup
            trigger={isSmallScreen ? "click" : "mouseenter focus"}
            interactive
            rounded
            content={<PopupLinkItems items={items} rounded />}
        >
            <a style={{ flex: 0 }}>
                <CircleButton outline>
                    <IconComp icon="more" />
                </CircleButton>
            </a>
        </Popup>
    );
};
