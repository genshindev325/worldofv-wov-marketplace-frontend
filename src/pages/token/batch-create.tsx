import type { NextPageContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styled from "styled-components";
import BatchCreateContent from "../../components/BatchCreate/BatchCreateContent";
import BatchCreateProvider from "../../components/BatchCreate/BatchCreateContext";
import { Divider } from "../../components/common/Divider";
import { Flex } from "../../components/common/Flex";
import { Text } from "../../components/common/Text";
import Head from "../../components/Head";
import common from "../../styles/_common";

const { container } = common;

export default function BatchCreate() {
    return (
        <>
            <Head title="Create Multiple NFTs" />
            <Container>
                <Flex flexDirection="column" columnGap={4} mt={5}>
                    <Text variant="h2" textAlign="center">
                        Create Multiple NFTs
                    </Text>
                    <Divider />
                    <BatchCreateProvider>
                        <BatchCreateContent />
                    </BatchCreateProvider>
                </Flex>
            </Container>
        </>
    );
}

const Container = styled.div`
    ${container}
`;

export async function getServerSideProps(context: NextPageContext) {
    const locale = context.locale || "en";

    return {
        props: {
            ...(await serverSideTranslations(locale, ["recaptcha_banner"])),
        },
    };
}
