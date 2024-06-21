import React from "react";
import styled from "styled-components";
import { TopUserFragment } from "../generated/graphql";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { UserData } from "../types/UserData";
import Link from "./Link";
import UserAvatar from "./UserAvatar";

const { media, dark } = mixins;
const {
    colors: { neutrals },
} = variables;

const UserCard: React.FC<TopUserFragment> = (props) => {
    const user = new UserData(props.user);

    return (
        <Link href={`/profile/${user.profileIdentifier}`} passHref>
            <Container>
                <CoverImage src={user.coverImage} />

                <InnerContainer>
                    <UserAvatar
                        size={80}
                        src={user.assets?.[0]?.url || user.profileImage}
                        verified={user.verified}
                        verifiedLevel={user.verifiedLevel}
                    />

                    <UserName>{user.username}</UserName>
                </InnerContainer>
            </Container>
        </Link>
    );
};

const Container = styled.div`
    cursor: pointer;
    overflow: hidden;
    border-radius: 16px;
    background: ${neutrals[8]};
    box-shadow: 0px 4px 24px -6px rgba(15, 15, 15, 0.12);

    ${dark`
        background: ${neutrals[2]};
    `}
`;

const InnerContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: -50px;
    padding: 0 16px 16px;

    > :first-child {
        border: 3px solid ${neutrals[8]};
        border-radius: 100%;

        ${dark`
            border-color: ${neutrals[2]};
        `}
    }
`;

const CoverImage = styled.div<{ src?: string }>`
    height: 100px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: cover;
    background-image: ${({ src }) => `url(${src})`};

    @media (max-width: 800px) {
        height: 80px;
    }
`;

const UserName = styled.div`
    margin-top: 8px;
    font-weight: 600;
    padding: 0 16px;
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export default UserCard;
