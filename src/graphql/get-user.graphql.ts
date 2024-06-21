import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const FragmentUser = gql`
    fragment User on User {
        address
        profileId
        name
        description
        email
        firstName
        lastName
        customUrl
        websiteUrl
        twitterUrl
        discordUrl
        facebookUrl
        instagramUrl
        blacklisted
        verified
        verifiedLevel
        bannerImageUrl
        landingTab
        showEmail
        showBalance
        isEmailNotificationEnabled
        isAdmin

        assets {
            ...Asset
        }
    }
`;

export const QueryGetUser = gql`
    ${FragmentAsset}
    ${FragmentUser}

    query GetUser($address: String, $customUrl: String, $email: String) {
        user: getUser(address: $address, customUrl: $customUrl, email: $email) {
            ...User
        }
    }
`;
