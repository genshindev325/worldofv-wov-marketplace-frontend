import Link from "@/components/Link";
import { hasCookie, setCookie } from "cookies-next";
import { useMemo, useState } from "react";
import CircleButton from "../../CircleButton";
import { Flex } from "../../common/Flex";
import { Text } from "../../common/Text";
import Icon from "../../Icon";

export const COOKIE = "isSync1BrowserBannerClosed12wa";

export const Sync1Banner = () => {
    const [seen, setSeen] = useState(hasCookie(COOKIE));

    const isSync1 = useMemo(
        () =>
            typeof navigator === "object"
                ? navigator.userAgent.includes("Sync/")
                : false,
        []
    );

    const handleClose = () => {
        setSeen(true);
        setCookie(COOKIE, true);
    };

    if (seen || !isSync1) return null;

    return (
        <Flex
            bg="errorDark15"
            alignItems="center"
            justifyContent="space-between"
        >
            <Text
                variant="body2"
                color="white"
                ml={3}
                mr={3}
                mt={{ _: 2, m: 3 }}
                mb={{ _: 2, m: 3 }}
                lineHeight={{ _: 6, m: 8 }}
            >
                VeChain Sync will no longer be supported.
                <Text variant="caption2">
                    Please consider migrating your wallet to{" "}
                    <Link href="https://www.veworld.net/">
                        <a target="_blank">VeWorld</a>
                    </Link>
                    .
                </Text>
            </Text>

            <CircleButton outline borderless small onClick={handleClose}>
                <Icon icon="close" />
            </CircleButton>
        </Flex>
    );
};
