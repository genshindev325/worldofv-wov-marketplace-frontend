import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const FragmentTopUser = gql`
    ${FragmentAsset}

    fragment TopUser on TopUser {
        kind
        address
        position

        user {
            address
            name
            customUrl
            bannerImageUrl
            verified
            verifiedLevel
            profileId
            blacklisted
            assets {
                ...Asset
            }
        }
    }
`;

export const QueryGetTopUsers = gql`
    ${FragmentTopUser}

    query GetTopUsers($kind: TopUserKind!) {
        users: getTopUsers(kind: $kind) {
            ...TopUser
        }
    }
`;
