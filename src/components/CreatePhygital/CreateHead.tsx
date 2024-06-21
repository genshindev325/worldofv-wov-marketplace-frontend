import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { VideoPlayer } from "../BurnMintingSingle/VideoPlayer";
import { Flex } from "../common/Flex";
import { Spacer } from "../common/Spacer";
import { Text } from "../common/Text";
import Link from "../Link";

const { media } = mixins;
const {
    typography: { h2 },
} = variables;

const CreateHead = () => (
    <>
        <Container>
            <Flex
                flexDirection={{ _: "column", m: "row" }}
                alignItems={{ _: "flex-start", m: "center" }}
                columnGap={{ _: 3, m: 0 }}
                justifyContent="space-between"
                width="100%"
            >
                <Text variant="h2">Create a new Phygital</Text>
                <Link href="https://wa.me/message/OVCG62VAZE63P1" passHref>
                    <StyledA target="_blank">Buy NFC Chip</StyledA>
                </Link>
            </Flex>
        </Container>
        <VideoPlayer src="https://player.vimeo.com/video/801715347?h=6b2e018f13" />
        <Spacer y size={4} />
    </>
);

const Container = styled.div`
    display: flex;
    margin-bottom: 20px;

    ${media.d`
        flex-direction: column-reverse;
        align-items: flex-start;
    `}

    ${media.m`
        margin-bottom: 32px;
    `}
`;

const StyledA = styled.a`
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes[5]}px;

    @media only screen and (min-width: ${({ theme }) => theme.breakpoints.a}) {
        font-size: ${({ theme }) => theme.fontSizes[4]}px;
    }
`;

export default CreateHead;
