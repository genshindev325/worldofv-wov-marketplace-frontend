import { gql } from "graphql-request";

export const FragmentHomeBanner = gql`
    fragment HomeBanner on HomeBanner {
        id
        image
        position
        collectionId
        artist
        url
    }
`;

export const QueryGetHomeBanners = gql`
    ${FragmentHomeBanner}

    query GetHomeBanners {
        banners: getHomeBanners {
            ...HomeBanner
        }
    }
`;
