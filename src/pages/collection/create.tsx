import { NextPage } from "next";
import styled from "styled-components";
import EditCollection from "../../components/EditCollection/EditCollection";
import Head from "../../components/Head";
import sections from "../../styles/_section";

const { section } = sections;

interface CreateCollectionProps {
    collection?: any;
}

const CreateCollection: NextPage<CreateCollectionProps> = ({ collection }) => (
    <>
        <Head title={collection ? "Edit Collection" : "Create Collection"} />
        <Container id="edit-collection">
            <InnerContainer>
                <EditCollection {...{ collection }} />
            </InnerContainer>
        </Container>
    </>
);

const Container = styled.div``;

const InnerContainer = styled.div`
    ${section};
`;

export default CreateCollection;
