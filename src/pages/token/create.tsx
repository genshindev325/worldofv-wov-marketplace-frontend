import { useMediaQuery } from "@react-hook/media-query";
import type { NextPageContext } from "next";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styled from "styled-components";
import CreateBody from "../../components/Create/CreateBody";
import CreateHead from "../../components/Create/CreateHead";
import CreateProvider from "../../components/Create/CreateProvider";
import Head from "../../components/Head";
import Preview from "../../components/Preview/Preview";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import sections from "../../styles/_section";
import variables from "../../styles/_variables";

const { media } = mixins;
const { section } = sections;
const { container } = common;
const { breakpoints } = variables;

const Create: NextPage = () => {
    const showPreview = !useMediaQuery(
        `only screen and (max-width: ${breakpoints.t})`
    );

    return (
        <>
            <Head title="Create NFT" />

            <CreateProvider>
                <Container className="create">
                    <InnerContainer>
                        <ContentWrapper>
                            <CreateHead />
                            <CreateBody />
                        </ContentWrapper>

                        {showPreview && <Preview />}
                    </InnerContainer>
                </Container>
            </CreateProvider>
        </>
    );
};

const Container = styled.div`
    ${section};

    ${media.x`
        padding-top: 80px;
    `}

    ${media.m`
        padding-top: 64px;
    `}
`;

const InnerContainer = styled.div`
    ${container};
    display: flex;
    align-items: flex-start;

    ${media.t`
        display: block;
    `}
`;

const ContentWrapper = styled.div`
    flex: 0 0 calc(100% - 352px);
    width: calc(100% - 352px);
    padding-right: 128px;

    ${media.x`
        padding-right: 64px;
    `}

    ${media.d`
        flex: 0 0 calc(100% - 304px);
        width: calc(100% - 304px);
        padding-right: 32px;
    `}

    ${media.t`
        width: 100%;
        padding: 0;
    `}
`;

export default Create;

export async function getServerSideProps(context: NextPageContext) {
    const locale = context.locale || "en";

    return {
        props: {
            ...(await serverSideTranslations(locale, ["recaptcha_banner"])),
        },
    };
}
