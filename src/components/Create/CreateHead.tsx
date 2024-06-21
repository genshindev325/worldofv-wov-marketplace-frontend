import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";

const { media } = mixins;
const {
    typography: { h2 },
} = variables;

const CreateHead = () => (
    <Container>
        <Title>Create a new NFT</Title>
    </Container>
);

const Container = styled.div`
    display: flex;
    margin-bottom: 40px;

    ${media.d`
        flex-direction: column-reverse;
        align-items: flex-start;
    `}

    ${media.m`
        margin-bottom: 32px;
    `}
`;

const Title = styled.h2`
    ${h2};
`;

export default CreateHead;
