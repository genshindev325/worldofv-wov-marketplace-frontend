import { gql } from "graphql-request";
import { FragmentAsset } from "./asset.graphql";

export const MutationUpdateUser = gql`
    ${FragmentAsset}

    mutation UpdateUser(
        $email: String
        $description: String
        $customUrl: String
        $websiteUrl: String
        $facebookUrl: String
        $twitterUrl: String
        $discordUrl: String
        $instagramUrl: String
        $landingTab: ProfileTabs
        $showEmail: Boolean
        $showBalance: Boolean
        $isEmailNotificationEnabled: Boolean
        $profileImage: Upload
        $bannerImage: Upload
        $firstName: String
        $lastName: String
    ) {
        user: updateUser(
            email: $email
            description: $description
            customUrl: $customUrl
            websiteUrl: $websiteUrl
            facebookUrl: $facebookUrl
            twitterUrl: $twitterUrl
            discordUrl: $discordUrl
            instagramUrl: $instagramUrl
            landingTab: $landingTab
            showEmail: $showEmail
            showBalance: $showBalance
            isEmailNotificationEnabled: $isEmailNotificationEnabled
            profileImage: $profileImage
            bannerImage: $bannerImage
            firstName: $firstName
            lastName: $lastName
        ) {
            address
            profileId
            name
            description
            email
            firstName
            lastName
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
`;
