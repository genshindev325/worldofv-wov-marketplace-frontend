import React from "react";
import styled from "styled-components";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { ITeamMemberData } from "../../types/TeamMemberData";

const { media } = mixins;
const { container } = common;
const {
    colors: { neutrals },
    typography: { bodyBold2, body1, body2 },
} = variables;

const AboutTeamMember: React.FC<ITeamMemberData> = ({ name, role, img }) => {
    return (
        <Container>
            <ContainerImage>
                <img src={img} alt={name} />
            </ContainerImage>

            <ContainerTitle>{name}</ContainerTitle>
            <ContainerDescription>{role}</ContainerDescription>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-width: 300px;
`;

const ContainerImage = styled.figure`
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }
`;

const ContainerTitle = styled.h4`
    ${bodyBold2};
    text-align: center;

    ${media.m`
        ${bodyBold2};
    `}

    ${media.s`
        ${body1};
    `}
`;

const ContainerDescription = styled.p`
    color: ${neutrals[4]};
    ${body2};
    text-align: center;
`;

export default AboutTeamMember;
