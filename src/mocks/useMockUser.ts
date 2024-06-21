import { jwtAtom } from "@/store/atoms";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { AssetSize, ProfileTabs, VerifiedStatus } from "../generated/graphql";
import { UserData } from "../types/UserData";

const MOCK_USER: UserData = {
    address: "0x76422A6BeD452EdB64E399210608Ca59c10C7660",
    profileId: 4828,
    profileImage: "http://",
    profileIdentifier: "123",
    canMint: true,
    canBuy: true,
    canSell: true,
    canTransfer: true,
    hasImage: true,
    name: "Mock user",
    shortAddress: "bla",
    username: "bla",
    picassoImage: "http://",
    // description: null,
    email: "email@example.com",
    // customUrl: null,
    // websiteUrl: null,
    // facebookUrl: null,
    // twitterUrl: null,
    // discordUrl: null,
    // instagramUrl: null,
    blacklisted: false,
    verified: false,
    verifiedLevel: VerifiedStatus.Verified,
    landingTab: ProfileTabs.Collected,
    isAdmin: true,
    showEmail: false,
    showBalance: false,
    isEmailNotificationEnabled: true,
    assets: [
        {
            size: AssetSize.Original,
            url: "https://wovartlimited.mypinata.cloud/ipfs/QmR2FNNC4UiFxaWrDhmRps7NqLPcACytTng9CfrQeo7GPG",
            mimeType: "image/*",
        },
    ],
};

/**
 * Injects a mocked user into Recoil store
 */
export function useMockUser() {
    const setJwt = useSetRecoilState(jwtAtom);

    useEffect(() => {
        setJwt(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHg4OGIxMDE2OTFjYzVFOGFjZDJhNjBEMkUwNzlGRDYwNWFCMjFiZTVBIiwiaWF0IjoxNjc3NzcyNjEyfQ.qsPVlmR-mBg71UBLhO0zYyMknWPhcyaNGP2GMbJ4PKo"
        );
    }, [setJwt]);
}
