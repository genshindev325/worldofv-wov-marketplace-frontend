import { gql } from "graphql-request";

export const MutationUpsertHomeCollection = gql`
    mutation UpsertHomeCollection(
        $id: String
        $position: Int!
        $title: String!
        $startsAt: String!
        $bannerImageUrl: String!
        $bannerLinkUrl: String!
        $avatarImageUrl: String
        $avatarLinkUrl: String
        $avatarName: String
        $avatarVerifiedLevel: UsersVerifiedStatus
    ) {
        drop: upsertHomeCollection(
            id: $id
            position: $position
            title: $title
            startsAt: $startsAt
            bannerImageUrl: $bannerImageUrl
            bannerLinkUrl: $bannerLinkUrl
            avatarImageUrl: $avatarImageUrl
            avatarLinkUrl: $avatarLinkUrl
            avatarName: $avatarName
            avatarVerifiedLevel: $avatarVerifiedLevel
        ) {
            id
        }
    }
`;
