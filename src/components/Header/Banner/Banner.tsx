import { useMediaQuery } from "@react-hook/media-query";
import { getCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import mixins from "../../../styles/_mixins";
import CircleButton from "../../CircleButton";
import { Flex } from "../../common/Flex";
import { Text } from "../../common/Text";
import Icon from "../../Icon";
import Link from "../../Link";
const { dark } = mixins;

export const COOKIE = `isAnnouncementBarClosed_UpdateMay18`;
// export const COOKIE = `isWarningBarClosed`;
// export const COOKIE = `isBlackFridayBarClosed`;

export const Banner = () => {
    // Let's start by hidding the banner...
    const [seen, setSeen] = useState(true);

    const handleClose = () => {
        setSeen(true);
        setCookie(COOKIE, true);
    };
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.m})`);

    // ...and only show it when unseen.
    useEffect(() => {
        setSeen(Boolean(getCookie(COOKIE)));
    }, []);

    if (seen) return null;

    return (
        <Flex bg="primary" alignItems="center" justifyContent="center">
            {!isSmallScreen && (
                <Text
                    variant="captionBold1"
                    color="white"
                    textAlign="center"
                    ml={1}
                    mr={1}
                    lineHeight={6}
                >
                    <Link href="/collection/Genesis" passHref>
                        <BannerLink>
                            Collect Genesis Cards to generate{" "}
                            <strong>FREE</strong> $WoV Tokens and unlock special
                            perks & features.{" "}
                            <BannerLinkBtn>Shop now</BannerLinkBtn>
                        </BannerLink>
                    </Link>
                </Text>
            )}
            {isSmallScreen && (
                <Text
                    variant="captionBold1"
                    color="white"
                    textAlign="center"
                    ml={1}
                    mr={1}
                    mt={2}
                    mb={2}
                    lineHeight={8}
                >
                    <Link href="/collection/Genesis" passHref>
                        <BannerLink>
                            Collect Genesis Cards to generate{" "}
                            <strong>FREE</strong> $WoV Tokens.{" "}
                            <BannerLinkBtn>Shop now</BannerLinkBtn>
                        </BannerLink>
                    </Link>
                </Text>
            )}
            <CircleButton small onClick={handleClose}>
                <Icon icon="close" />
            </CircleButton>
        </Flex>
    );
};

// export const Banner = () => {
//     const theme = useTheme();
//     // Let's start by hidding the banner...
//     const [seen, setSeen] = useState(true);

//     const handleClose = () => {
//         setSeen(true);
//         setCookie(COOKIE, true);
//     };

//     // ...and only show it when unseen.
//     useEffect(() => {
//         setSeen(Boolean(getCookie(COOKIE)));
//     }, []);

//     if (seen) return null;

//     return (
//         <Flex
//             bg="#ffdb43"
//             py={1}
//             px={3}
//             alignItems="center"
//             justifyContent="center"
//         >
//             <Text
//                 variant="captionBold1"
//                 color="black"
//                 textAlign="center"
//                 fontWeight="bold"
//                 mr={2}
//             >
//                 <Text
//                     variant="captionBold1"
//                     color="white"
//                     textAlign="center"
//                     fontWeight="bold"
//                     fontSize={16}
//                     mr={3}
//                     textShadow="3px 3px 3px black"
//                     as="span"
//                 >
//                     BLACK FRIDAY
//                 </Text>
//                 0% Marketplace Fees On All Sales, November 25th - 27th
//             </Text>
//             <Box p={2} onClick={handleClose}>
//                 <Icon icon="close" color={theme.colors.black} />
//             </Box>
//         </Flex>
//     );
// };

const BannerLink = styled.a`
    margin-left: 10px;
    margin-right: 10px;
    &:hover,
    &:active {
        color: ${({ theme }) => theme.colors.white};
    }

    @media only screen and (max-width: ${({ theme }) => theme.breakpoints.m}) {
        font-size: 12px;
    }
`;

const BannerLinkBtn = styled.a`
    font-weight: bold;
    padding: 3px 10px;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 30px;
    display: inline-block;
    margin-left: 10px;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 12px;

    @media only screen and (max-width: ${({ theme }) => theme.breakpoints.m}) {
        margin-left: 10px;
        line-height: 20px;
    }
`;
