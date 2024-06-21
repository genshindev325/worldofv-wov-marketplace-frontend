import styled from "styled-components";
import { VerifiedStatus } from "../../generated/graphql";
import { useCollection } from "../../providers/CollectionProvider";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { isSameAddress } from "../../utils/isSameAddress";
import { Text } from "../common/Text";
import ReadMore from "../ReadMore";
import UserAvatar from "../UserAvatar";

const { media } = mixins;
const {
    typography: { caption2 },
} = variables;

export const CollectionInfo = () => {
    const { collection } = useCollection();

    return (
        <Container>
            {collection?.thumbnailImageUrl && (
                <CollectionAvatar
                    src={collection.thumbnailImageUrl}
                    verified={collection.isVerified}
                    verifiedLevel={VerifiedStatus.Verified}
                    size={100}
                    verifiedSize={26}
                />
            )}

            <Text variant="bodyBold1" wordBreak="break-word" textAlign="center">
                {collection.name}
            </Text>

            {collection.description && (
                <Text
                    variant="caption2"
                    whiteSpace="pre-wrap"
                    color="accent"
                    textAlign="center"
                    mt={1}
                >
                    <ReadMore withToggle>{collection.description}</ReadMore>
                </Text>
            )}

            {!isSameAddress(
                collection.creator?.address,
                collection.smartContractAddress
            ) &&
                collection?.creator?.name && (
                    <CollectionCreator>
                        Created by&nbsp;
                        <CollectionCreatorName
                            href={`/profile/${collection.creator!.address}`}
                        >
                            {collection.creator?.name}
                        </CollectionCreatorName>
                    </CollectionCreator>
                )}
        </Container>
    );
};

const Container = styled.div`
    padding: 12px 28px 15px;
    border-radius: 16px;
    box-shadow: 0px 40px 32px -24px rgba(15, 15, 15, 0.12);
    background: ${({ theme }) => theme.colors.background};
    [data-theme="dark"] & {
        background: ${({ theme }) => theme.colors.highlight};
        ${media.t`
            background: none;
        `}
    }
    border: 1px solid ${({ theme }) => theme.colors.muted};
    text-align: center;

    ${media.t`
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border: none;
        box-shadow: none;
        background: none;
    `}
`;

const CollectionAvatar = styled(UserAvatar)`
    margin: 0 auto 24px;
    margin: 0 auto 14px;

    ${({ theme }) => media.t`
        margin-top: -140px;

        img {
            border: 3px solid ${theme.colors.background};
        }
    `}
    ${media.m`
        margin-top: -70px;
        // width: 80px;
        // min-width: 80px;
        // height: 80px;
        // min-height: 80px;
    `}
`;

const CollectionCreator = styled.div`
    margin-top: 30px;
    padding: 30px 0 0;
    border-top: 1px solid ${({ theme }) => theme.colors.muted};
    ${caption2};
    color: ${({ theme }) => theme.colors.accent};
`;

const CollectionCreatorName = styled.a`
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
    transition: color 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.primaryDark10};
    }
`;
