import Link from "next/link";
import styled from "styled-components";
import { Box } from "../common/Box";
import { Button } from "../common/Button";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import HomeCarousel from "./HomeCarousel";

const textProps = {
    variant: "h3" as "h3",
    fontSize: { _: 27, m: 28, d: 30, x: 40 },
};

const HomeHero = () => (
    <Box>
        <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-around"
            flexDirection={{ _: "column-reverse", t: "row" }}
            mt={3}
        >
            <Flex
                alignItems="center"
                justifyContent="center"
                pt={4}
                pr={{ _: "0", t: "3" }}
                width={{ _: "100%", t: "40%" }}
            >
                <Head>
                    <Text {...textProps}>
                        The first and largest{" "}
                        <Text {...textProps} color="primary" as="strong">
                            #GreenNFTs
                        </Text>{" "}
                        marketplace on VeChain.
                    </Text>
                    <Text
                        variant="h4"
                        color="neutral"
                        mt={3}
                        fontSize={{ _: 21, d: 24, x: 32 }}
                    >
                        Create & collect with 0 gas fees.
                    </Text>
                    <ButtonGroup>
                        <Link href="/marketplace" passHref>
                            <Button outline>Marketplace</Button>
                        </Link>

                        <Link href="/collections" passHref>
                            <Button outline>Collections</Button>
                        </Link>

                        <Link
                            href="https://vexchange.io/swap?outputCurrency=0x170F4BA8e7ACF6510f55dB26047C83D13498AF8A&inputCurrency=0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997&exactAmount=1000"
                            passHref
                        >
                            <a target="_blank">
                                <Button fullWidth outline>
                                    Buy WoV
                                </Button>
                            </a>
                        </Link>

                        <Link href="/collection/genesis" passHref>
                            <Button outline>Generate WoV</Button>
                        </Link>
                    </ButtonGroup>
                </Head>
            </Flex>
            <Flex
                alignItems="center"
                justifyContent="center"
                width={{ _: "100%", t: "60%" }}
            >
                <HomeCarousel />
            </Flex>
        </Box>
    </Box>
);

const Head = styled.div`
    margin-top: -50px;
    @media screen and (max-width: ${({ theme }) => theme.breakpoints.t}) {
        margin-top: 0px;
    }

    text-align: center;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    margin-top: 16px;

    > * {
        margin-top: 16px;
        min-width: 45%;

        @media screen and (max-width: ${({ theme }) => theme.breakpoints.x}) {
            min-width: 164px;
        }
    }

    @media screen and (max-width: ${({ theme }) => theme.breakpoints.p}) {
        > * {
            width: 45%;
            margin-left: 0 !important;
        }

        ${Button}, * {
            font-size: 14px;
        }
    }

    @media screen and (max-width: ${({ theme }) => theme.breakpoints.s}) {
        > * {
            min-width: auto;
        }

        ${Button} {
            min-width: auto;
        }
    }
`;

export default HomeHero;
