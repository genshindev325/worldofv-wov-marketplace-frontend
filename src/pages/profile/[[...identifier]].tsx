import parseJwt from "@/utils/parseJwt";
import { getCookie } from "cookies-next";
import { NextPage, NextPageContext } from "next";
import { NextQueryParamProvider } from "next-query-params";
import Web3 from "web3";
import Head from "../../components/Head";
import { ProfilePageContent } from "../../components/profile/ProfilePageContent";
import { UserFragment } from "../../generated/graphql";
import {
    BatchSelectProvider,
    OfferBatchSelectContext,
    TokenBatchSelectContext,
} from "../../providers/BatchSelectProvider";
import ProfileProvider from "../../providers/ProfileProvider";
import { GraphQLService } from "../../services/GraphQLService";
import { OfferData } from "../../types/OfferData";
import { IUserTokensCount } from "../../types/UserData";

interface ProfileProps {
    user: UserFragment;
    userTokensCount: IUserTokensCount;
    referer: string | null;
    host: string | null;
}

const Profile: NextPage<ProfileProps> = ({
    user,
    userTokensCount,
    referer,
    host,
}) => (
    <>
        <Head title={`${user.name} - Profile`} description={user.description} />

        <NextQueryParamProvider>
            <ProfileProvider {...{ user, userTokensCount, referer, host }}>
                <BatchSelectProvider
                    context={TokenBatchSelectContext}
                    getId={(t) => t.tokenId}
                >
                    <BatchSelectProvider
                        context={OfferBatchSelectContext}
                        getId={(o: OfferData) => o.offerId}
                    >
                        <ProfilePageContent />
                    </BatchSelectProvider>
                </BatchSelectProvider>
            </ProfileProvider>
        </NextQueryParamProvider>
    </>
);

export async function getServerSideProps(context: NextPageContext) {
    const referer = context.req?.headers.referer ?? null;
    const host = context.req?.headers.host ?? null;
    const identifier = context.query?.identifier
        ? context.query.identifier[0]
        : undefined;

    if (identifier) {
        const userIdentifier = Web3.utils.isAddress(identifier)
            ? { address: identifier }
            : { customUrl: identifier };

        const res = await GraphQLService.sdk()
            .GetUser(userIdentifier)
            .catch(() => null);

        // User found
        if (res?.user) {
            return {
                props: {
                    user: res.user,
                    referer,
                    host,
                },
            };
        }

        // Fallback on user returning address only
        if (userIdentifier.address) {
            return {
                props: {
                    user: { address: userIdentifier.address },
                    referer,
                    host,
                },
            };
        }
    }

    const jwt = getCookie("jwt", context)?.toString();
    const walletAddress = jwt ? parseJwt(jwt) : null;

    return {
        redirect: {
            destination: walletAddress ? `/profile/${walletAddress}` : "/",
        },
    };
}

export default Profile;
