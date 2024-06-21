import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const FragmentVerifiedDrop = gql`
    ${FragmentAsset}

    fragment VerifiedDrop on VerifiedDrop {
        id
        position
        dateTime
        imageUrl
        title
        address
        collectionId
        tokenId

        artist {
            address
            name
            customUrl
            verified
            verifiedLevel

            assets {
                ...Asset
            }
        }

        collection {
            collectionId
            name
            thumbnailImageUrl
            bannerImageUrl
        }

        token {
            tokenId
            smartContractAddress
            name
        }

        asset {
            url
            mimeType
            size
        }
    }
`;

export const QueryGetVerifiedDrops = gql`
    ${FragmentVerifiedDrop}

    query GetVerifiedDrops {
        drops: getVerifiedDrops {
            ...VerifiedDrop
        }
    }
`;
