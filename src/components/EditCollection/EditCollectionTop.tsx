import React from "react";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";

const { media, dark } = mixins;
const {
    colors: { neutrals },
    typography: { h2 },
} = variables;

interface EditCollectionTopProps {
    collection?: any;
}

const EditCollectionTop: React.FC<EditCollectionTopProps> = ({
    collection,
}) => (
    <Container>
        <Title>
            {collection?.collectionId ? "Edit" : "Create"} your collection
        </Title>

        <Description>
            You can change the collection data at any time.
        </Description>
    </Container>
);

const Container = styled.div`
    margin-bottom: 64px;

    ${media.m`
        margin-bottom: 32px;
        padding-bottom: 16px;
        border-bottom: 1px solid ${neutrals[6]};

        ${dark`
            border-color: ${neutrals[3]};
        `}
    `}
`;

const Title = styled.h1`
    margin-bottom: 16px;
    ${h2}
`;

const Description = styled.div`
    color: ${neutrals[4]};

    strong {
        font-weight: 500;
        color: ${neutrals[2]};

        ${dark`
            color: ${neutrals[8]};
        `}
    }
`;

export default EditCollectionTop;
