import { useUserDataLegacy } from "@/hooks/useUserData";
import React from "react";
import { HiOutlineLink } from "react-icons/hi";
import styled from "styled-components";
import mixins from "../../../styles/_mixins";
import variables from "../../../styles/_variables";
import { useBalance } from "../../BalanceProvider";
import Link from "../../Link";
import UserAvatar from "../../UserAvatar";
import { useDashBoard } from "../DashBoardProvider";

const { dark } = mixins;
const {
    colors: { neutrals, white, green, yellow },
    typography: { captionBold1 },
    breakpoints,
} = variables;

const DashboardUserInfo: React.FC = () => {
    const user = useUserDataLegacy();
    const { balanceFormatted } = useBalance();
    const { totalGenesis, totalGenSpecial } = useDashBoard();

    return (
        <Container>
            {user && (
                <UserInfoContainer>
                    <AvatarContainer
                        size={160}
                        src={user!.profileImage}
                        verified={user!.verified}
                        verifiedLevel={user!.verifiedLevel}
                    />
                    <UserName>
                        {user!.name ? user!.name : user!.shortAddress}
                    </UserName>
                </UserInfoContainer>
            )}
            <CardsContainer>
                {balanceFormatted && (
                    <Card isSingle={true}>{balanceFormatted.WoV} WoV</Card>
                )}
                <Link href={"/collection/genesis"} passHref>
                    <Card className="link">
                        <CollectionName>
                            Genesis <HiOutlineLink size={18} />
                        </CollectionName>
                        <OwnedGenesis color="linear-gradient(90deg, rgba(43,206,166,1) 0%, rgba(83,192,202,1) 100%)">
                            {totalGenesis}
                        </OwnedGenesis>
                    </Card>
                </Link>
                <Link href={"/collection/genesis-special"} passHref>
                    <Card className="link">
                        <CollectionName>
                            Genesis Special <HiOutlineLink size={18} />
                        </CollectionName>
                        <OwnedGenesis color="#ffb200">
                            {totalGenSpecial}
                        </OwnedGenesis>
                    </Card>
                </Link>
            </CardsContainer>
        </Container>
    );
};

const Container = styled.aside`
    ${captionBold1}

    padding: 32px 28px;
    border-radius: 16px;
    box-shadow: 0px 40px 32px -24px rgba(15, 15, 15, 0.12);
    background-color: ${neutrals[6]};
    padding: 30px;
    border-radius: 0 15px 15px 0;
    text-align: center;
    display: flex;
    flex-direction: column;

    > :first-child {
        margin: 0 auto 24px !important;
    }
    ${dark`
        background-color: ${neutrals[4]};
    `}
    @media only screen and (max-width: ${breakpoints.x}) {
        flex-direction: row;
        justify-content: center;
    }
`;

const UserInfoContainer = styled.div`
    @media only screen and (max-width: ${breakpoints.x}) {
        flex-direction: row;
        padding-right: 20px;
    }
    @media only screen and (max-width: ${breakpoints.m}) {
        display: none;
    }
`;

const AvatarContainer = styled(UserAvatar)`
    background-color: white;
    border-radius: 50%;
    &::after {
        right: 14px;
    }
`;

const UserName = styled.p`
    padding-top: 20px;
`;

const CardsContainer = styled.div`
    .link {
        cursor: pointer;
    }
    @media only screen and (max-width: ${breakpoints.x}) {
        width: 70%;
    }
    @media only screen and (max-width: ${breakpoints.m}) {
        width: 100%;
    }
`;

const Card = styled.div<{ isSingle?: boolean | null }>`
    height: 50px;
    background-color: ${neutrals[4]};
    margin-top: 20px;
    color: ${white};
    display: flex;
    justify-content: ${({ isSingle }) =>
        isSingle ? "center" : "space-between"};
    align-items: center;
    border-radius: 5px;
    ${dark`
        background-color: ${neutrals[2]};
    `}
    @media only screen and (max-width: ${breakpoints.x}) {
        &:first-child {
            margin-top: 0;
        }
    }
`;

const CollectionName = styled.p`
    width: 70%;
    text-align: center;
`;

const OwnedGenesis = styled.div<{ color: string }>`
    padding: 13px 0;
    background: ${({ color }) => color};
    width: 30%;
    border-radius: 0 5px 5px 0;
`;

export default DashboardUserInfo;
