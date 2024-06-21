import { gql } from "graphql-request";

export const FragmentHomeCollection = gql`
    fragment HomeCollection on HomeCollection {
        id
        position
        title
        startsAt

        bannerImageUrl
        bannerLinkUrl

        avatarImageUrl
        avatarLinkUrl
        avatarName
        avatarVerifiedLevel
    }
`;

export const QueryGetHomeCollections = gql`
    ${FragmentHomeCollection}

    query GetHomeCollections {
        collections: getHomeCollections {
            ...HomeCollection
        }
    }
`;
