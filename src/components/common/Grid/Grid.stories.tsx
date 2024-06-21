import { ComponentMeta, ComponentStory } from "@storybook/react";
import styled from "styled-components";
import { Grid } from "./Grid";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Grid",
    component: Grid,
    argTypes: {},
} as ComponentMeta<typeof Grid>;

const Container = styled.div`
    border: 1px solid red;
`;
const Box = styled.div`
    height: 100px;
    width: 100%;
    border: 1px solid green;
`;

export const RowGapNumber: ComponentStory<typeof Grid> = () => (
    <Container>
        <Grid gridRowGap={3}>
            <Box />
            <Box />
        </Grid>
    </Container>
);
