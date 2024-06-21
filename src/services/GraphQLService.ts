import { GraphQLClient } from "graphql-request";
import { Client as WebSocketClient, createClient } from "graphql-ws";
import { getSdk } from "../generated/graphql";

export class GraphQLService {
    public static readonly API_URL =
        process.env.NEXT_PUBLIC_GRAPHQL_API_BASE_URL!;

    public static readonly WS_URL =
        process.env.NEXT_PUBLIC_GRAPHQL_WS_BASE_URL!;

    /**
     * @deprecated Use `sdk` instead.
     */
    public static client(jwt?: string): GraphQLClient {
        return new GraphQLClient(this.API_URL, {
            headers: {
                ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
            },
        });
    }

    public static sdk(jwt?: string) {
        return getSdk(this.client(jwt));
    }

    public static ws(): WebSocketClient {
        return createClient({ url: this.WS_URL });
    }
}
