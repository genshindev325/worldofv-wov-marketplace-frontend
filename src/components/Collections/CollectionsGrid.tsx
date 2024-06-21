import React from "react";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import calculateCardSize from "../../utils/calculateCardSize";
import CardCollection from "../CardCollection";

const { media } = mixins;

interface CollectionsGridProps {
    collections: any[];
}

const CollectionsGrid: React.FC<CollectionsGridProps> = ({ collections }) => (
    <Container>
        <Grid>
            {collections.map((props: any) => (
                <CardCollection key={props.collectionId} {...props} />
            ))}
        </Grid>
    </Container>
);

const Container = styled.div``;

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;

    > * {
        ${calculateCardSize(4, 24)};
        margin: 24px 12px 0;

        ${media.w`
            ${calculateCardSize(3, 24)};
        `}

        ${media.t`
            ${calculateCardSize(2, 24)};
        `}

        ${media.a`
            ${calculateCardSize(1, 24)};
        `}
    }
`;

export default CollectionsGrid;
