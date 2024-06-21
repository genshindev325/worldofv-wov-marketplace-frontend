import Details from "@/components/Details/Details";
import Head from "@/components/Head";
import sections from "@/styles/_section";
import type { NextPageContext } from "next";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styled from "styled-components";

const { section } = sections;

const EditProfile: NextPage = () => (
    <>
        <Head title="Edit Profile" />
        <Container id="edit-profile">
            <InnerContainer>
                <Details />
            </InnerContainer>
        </Container>
    </>
);

const Container = styled.div``;

const InnerContainer = styled.div`
    ${section};
`;

export async function getServerSideProps(context: NextPageContext) {
    const locale = context.locale || "en";

    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
}

export default EditProfile;
