import styled from "styled-components";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";

const { containerLarge } = common;
const { media, dark } = mixins;

const {
    colors: { neutrals },
    typography: { h3, h4, body1, body2 },
} = variables;

const teamMembers = [
    {
        name: "Pierpaolo Guzzardi",
        role: "Developer",
        img: "https://media-exp1.licdn.com/dms/image/C4D03AQFgbcyz62FDNQ/profile-displayphoto-shrink_800_800/0/1615999405707?e=1648684800&v=beta&t=Txi5dgMA_daFQs3zlBqgZ0X86CyYyBTVD9_r3QxyOnU",
    },
    {
        name: "Pierpaolo Guzzardi",
        role: "Developer",
        img: "https://media-exp1.licdn.com/dms/image/C4D03AQFgbcyz62FDNQ/profile-displayphoto-shrink_800_800/0/1615999405707?e=1648684800&v=beta&t=Txi5dgMA_daFQs3zlBqgZ0X86CyYyBTVD9_r3QxyOnU",
    },
    {
        name: "Pierpaolo Guzzardi",
        role: "Developer",
        img: "https://media-exp1.licdn.com/dms/image/C4D03AQFgbcyz62FDNQ/profile-displayphoto-shrink_800_800/0/1615999405707?e=1648684800&v=beta&t=Txi5dgMA_daFQs3zlBqgZ0X86CyYyBTVD9_r3QxyOnU",
    },
    {
        name: "Pierpaolo Guzzardi",
        role: "Developer",
        img: "https://media-exp1.licdn.com/dms/image/C4D03AQFgbcyz62FDNQ/profile-displayphoto-shrink_800_800/0/1615999405707?e=1648684800&v=beta&t=Txi5dgMA_daFQs3zlBqgZ0X86CyYyBTVD9_r3QxyOnU",
    },
    {
        name: "Pierpaolo Guzzardi",
        role: "Developer",
        img: "https://media-exp1.licdn.com/dms/image/C4D03AQFgbcyz62FDNQ/profile-displayphoto-shrink_800_800/0/1615999405707?e=1648684800&v=beta&t=Txi5dgMA_daFQs3zlBqgZ0X86CyYyBTVD9_r3QxyOnU",
    },
];

const AboutTeam = () => (
    <Container>
        <Head>
            <Title>Thanks to our team</Title>
        </Head>

        <AboutTeamRow>
            {/*teamMembers.map((teamMember, key) => <AboutTeamColumn> <AboutTeamMember {...teamMember} key={key} /> </AboutTeamColumn>)*/}
        </AboutTeamRow>
    </Container>
);

const Container = styled.div`
    ${containerLarge};
    margin: 64px auto 16px;
    position: relative;

    .swiper-wrapper {
        padding: 16px 0;
    }
`;

const Head = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-bottom: 32px;
`;

const Title = styled.h2`
    ${h3};

    ${media.m`
        ${h4};
    `}

    ${media.s`
        ${body1};
    `}
`;

const AboutTeamRow = styled.div`
    display: flex;
    margin: 0 -16px;

    ${media.d`
        display: block;
        margin: 0;
    `}
`;

const AboutTeamColumn = styled.div`
    flex: 0 0 calc(20% - 32px);
    width: calc(50% - 32px);
    margin: 0 16px;

    ${media.d`
        width: 100%;
        margin: 0;
    `}

    &:not(:last-child) {
        ${media.d`
            margin-bottom: 64px;
        `}

        ${media.m`
            margin-bottom: 32px;
            border-bottom: 1px solid ${neutrals[6]};

            ${dark`
                border-color: ${neutrals[3]};
            `}
        `}
    }
`;

export default AboutTeam;
