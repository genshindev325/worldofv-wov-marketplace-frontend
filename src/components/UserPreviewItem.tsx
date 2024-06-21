import Link from "next/link";
import React from "react";
import styled from "styled-components";
import variables from "../styles/_variables";
import { UserData } from "../types/UserData";
import { formatUsername } from "../utils/formatUsername";
import UserAvatar from "./UserAvatar";

const {
    colors: { neutrals },
} = variables;

interface UserPreviewItemProps {
    label?: string;
    user: UserData;
    hrefPrefix?: string;
    isProductPage?: boolean;
}

const UserPreviewItem: React.FC<UserPreviewItemProps> = ({
    label,
    user,
    hrefPrefix = "/profile",
    isProductPage,
}) => {
    return (
        <Link href={`${hrefPrefix}/${user.customUrl || user.address}`} passHref>
            <Container>
                <Avatar
                    src={user.assets?.[0]?.url ?? user.profileImage}
                    verified={user.verified}
                    verifiedLevel={user.verifiedLevel}
                />

                <InfoWrapper>
                    {label && <Label>{label}</Label>}
                    <Name>
                        {isProductPage
                            ? user.username
                            : formatUsername(user.username)}
                    </Name>
                </InfoWrapper>
            </Container>
        </Link>
    );
};

const Container = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    padding-bottom: 16px;
`;

const Avatar = styled(UserAvatar).attrs(() => ({
    size: 48,
    verifiedSize: 16,
}))`
    margin-right: 16px;
`;

const InfoWrapper = styled.div`
    flex-grow: 1;
`;

const Label = styled.div`
    color: ${neutrals[4]};
`;

const Name = styled.div`
    font-weight: 500;
`;

export default UserPreviewItem;
