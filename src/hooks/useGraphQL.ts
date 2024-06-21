import { getSdk } from "@/generated/graphql";
import { GraphQLService } from "@/services/GraphQLService";
import { jwtAtom } from "@/store/atoms";
import { useMemo } from "react";
import { useRecoilState } from "recoil";

export default function useGraphQL() {
    const [jwt, setJwt] = useRecoilState(jwtAtom);

    /**
     * @deprecated Use `sdk` instead.
     */
    const client = useMemo(() => GraphQLService.client(jwt), [jwt]);

    const sdk = useMemo(() => getSdk(client), [client]);

    return { setJwt, client, sdk };
}
