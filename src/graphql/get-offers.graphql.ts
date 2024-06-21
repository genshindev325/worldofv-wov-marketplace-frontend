import { gql } from "graphql-request";

const FragmentOfferAssetFields = gql`
    fragment OfferAssetFields on AssetDTO {
        url
        mimeType
    }
`;

const FragmentOfferBidderFields = gql`
    fragment OfferBidderFields on OfferBidderDTO {
        name
        address
    }
`;

const FragmentOfferCollectionFields = gql`
    fragment OfferCollectionFields on OfferCollectionDTO {
        collectionId
        smartContractAddress
        name
        thumbnailImageUrl
    }
`;

const FragmentOfferTokenFields = gql`
    fragment OfferTokenFields on OfferTokenDTO {
        tokenId
        smartContractAddress
        name
        rank
    }
`;

const FragmentOfferEditionFields = gql`
    ${FragmentOfferAssetFields}

    fragment OfferEditionFields on OfferEditionDTO {
        smartContractAddress
        tokenId
        tokenName
        editionId
        ownerAddress
        stakingContractAddress
        auctionId
        saleId
        saleAddressVIP180
        royalty
        rank

        asset {
            ...OfferAssetFields
        }
    }
`;

const FragmentOfferFields = gql`
    ${FragmentOfferBidderFields}
    ${FragmentOfferCollectionFields}
    ${FragmentOfferTokenFields}
    ${FragmentOfferEditionFields}

    fragment OfferFields on OfferDTO {
        offerId
        smartContractAddress
        tokenId
        editionId
        bidderAddress
        price
        addressVIP180
        currency
        startingTime
        endTime
        type
        status

        highestOffer {
            price
            addressVIP180
        }

        asset {
            ...OfferAssetFields
        }

        bidder {
            ...OfferBidderFields
        }

        collection {
            ...OfferCollectionFields
        }

        token {
            ...OfferTokenFields
        }

        editions {
            ...OfferEditionFields
        }
    }
`;

export const QueryGetOffersForUser = gql`
    ${FragmentOfferFields}

    query GetOffersForUser(
        $address: String!
        $type: UserOfferType!
        $acceptorAddress: String
        $pagination: PaginationArgs!
    ) {
        getOffersForUser(
            address: $address
            type: $type
            acceptorAddress: $acceptorAddress
            pagination: $pagination
        ) {
            meta {
                total
                hasMore
            }
            offers {
                ...OfferFields
            }
        }
    }
`;

export const QueryGetOffersForToken = gql`
    ${FragmentOfferFields}

    query GetOffersForToken(
        $smartContractAddress: String!
        $tokenId: String!
        $acceptorAddress: String
    ) {
        getOffersForToken(
            smartContractAddress: $smartContractAddress
            tokenId: $tokenId
            acceptorAddress: $acceptorAddress
        ) {
            ...OfferFields
        }
    }
`;
