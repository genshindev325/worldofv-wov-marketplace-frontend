import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const MutationLogin = gql`
    ${FragmentAsset}

    mutation Login($annex: AnnexArgs!, $signature: String!) {
        login(annex: $annex, signature: $signature) {
            jwt
            user {
                address
                profileId
                name
                description
                email
                customUrl
                websiteUrl
                facebookUrl
                twitterUrl
                discordUrl
                instagramUrl
                blacklisted
                verified
                verifiedLevel
                bannerImageUrl
                landingTab
                isAdmin
                showEmail
                showBalance
                isEmailNotificationEnabled
                assets {
                    ...Asset
                }
            }
        }
    }
`;
