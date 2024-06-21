import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import Icon from "../Icon";

const { media, dark } = mixins;
const {
    colors: { neutrals, blue, red },
    typography: { h2 },
} = variables;

const DetailsTop = () => (
    <Container>
        <Title>Edit profile</Title>

        <Description>
            You can set preferred display name, create{" "}
            <strong>your profile URL</strong> and manage other personal
            settings.
        </Description>

        <RequiredText>
            <Icon icon="info-circle" />
            <span>
                <strong>Profile Photo</strong>, <strong>Display Name</strong>{" "}
                and <strong>Email</strong> are required to update the profile.
            </span>
        </RequiredText>
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

const RequiredText = styled(Description)`
    display: flex;
    align-items: center;
    margin-top: 8px;

    .icon {
        color: ${blue};
        margin-right: 8px;
    }
`;

export default DetailsTop;
