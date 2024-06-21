import { LoginMutationResult } from "@/generated/graphql";
import useGraphQL from "@/hooks/useGraphQL";
import { useUserData } from "@/hooks/useUserData";
import { GraphQLService } from "@/services/GraphQLService";
import { jwtAtom } from "@/store/atoms";
import { userAddressSelector } from "@/store/selectors";
import type { Connex } from "@vechain/connex";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast as toastify } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Transaction } from "thor-devkit";
import { thorify } from "thorify";
import Web3 from "web3";
import AbiService from "./AbiService";
import AuctionService from "./AuctionService";
import BurnMintService from "./BurnMintService";
import ConnexService from "./ConnexService";
import DelegationService from "./DelegationService";
import ExchangeService from "./ExchangeService";
import NftService from "./NftService";
import SaleService from "./SaleService";
import TransactionService from "./TransactionService";
import UserService from "./UserService";
import WalletService from "./WalletService";
import Web3AuthService from "./Web3AuthService";
import Web3Service from "./Web3Service";

/**
 * Nullable fields are only present when the code runs on the client.
 */
export interface BlockchainContext {
    abiService: AbiService;
    web3Service: Web3Service;
    connexService: ConnexService | null;
    exchangeService: ExchangeService | null;
    transactionService: TransactionService | null;
    nftService: NftService | null;
    saleService: SaleService | null;
    auctionService: AuctionService | null;
    delegationService: DelegationService | null;
    web3AuthService: Web3AuthService | null;
    walletService: WalletService | null;
    burnMintService: BurnMintService | null;
    userService: UserService | null;
}

const BlockchainContext = createContext<BlockchainContext>(
    new Proxy({} as any, {
        get() {
            throw new Error("Context not initialized.");
        },
    })
);

function useAbiService() {
    return useMemo(() => new AbiService(), []);
}

function useWeb3Service(abiService: AbiService) {
    const web3 = useMemo(
        () => thorify(new Web3(), process.env.NEXT_PUBLIC_VECHAIN_NODE!),
        []
    );

    return useMemo(() => new Web3Service(web3, abiService), [web3, abiService]);
}

function useConnexService(abiService: AbiService) {
    const userAddress = useRecoilValue(userAddressSelector);

    const [connex, setConnex] = useState<Connex>();

    // Connex library cannot be imported on the server since it requires access
    // to the global window instance.
    // Note: The `useEffect` hook only runs on client side.
    useEffect(() => {
        import("@vechain/connex").then(({ Connex }) => {
            setConnex(
                new Connex({
                    node: process.env.NEXT_PUBLIC_VECHAIN_NODE!,
                    network: process.env.NEXT_PUBLIC_NETWORK as "main" | "test",
                })
            );
        });
    }, []);

    const onSignatureRequest = useCallback(() => {
        // We set a timeout for the toast since the transaction
        // promise will remain pending indefinitely if the user does
        // not explicitly decline the transaction.
        const timeout = setTimeout(
            () => toastify.dismiss("INTERFACING_WITH_WALLET"),
            20000
        );

        toastify.loading("Interfacing with wallet...", {
            closeButton: true,
            closeOnClick: true,
            toastId: "INTERFACING_WITH_WALLET",
            onClose: () => clearTimeout(timeout),
        });
    }, []);

    const onSignatureResponse = useCallback(() => {
        toastify.dismiss("INTERFACING_WITH_WALLET");
    }, []);

    const onSignatureError = useCallback(() => {
        toastify.dismiss("INTERFACING_WITH_WALLET");
    }, []);

    return useMemo(
        () =>
            connex
                ? new ConnexService(
                      connex,
                      abiService,
                      userAddress,
                      onSignatureRequest,
                      onSignatureResponse,
                      onSignatureError
                  )
                : null,
        [
            connex,
            abiService,
            userAddress,
            onSignatureRequest,
            onSignatureResponse,
            onSignatureError,
        ]
    );
}

function useExchangeService(
    connexService: ConnexService | null,
    web3Service: Web3Service
) {
    return useMemo(
        () =>
            connexService
                ? new ExchangeService(connexService, web3Service)
                : null,
        [connexService, web3Service]
    );
}

function useTransactionService(
    connexService: ConnexService | null,
    walletService: WalletService | null
) {
    const onCheckTxRequest = useCallback((txID: string) => {
        toastify.loading("Transaction in progress...", {
            closeButton: true,
            closeOnClick: true,
            toastId: `CHECK_TRANSACTION_${txID}`,
        });
    }, []);

    const onCheckTxResponse = useCallback((txID: string) => {
        toastify.update(`CHECK_TRANSACTION_${txID}`, {
            render: "Transaction confirmed!",
            type: toastify.TYPE.SUCCESS,
            autoClose: 5000,
            isLoading: false,
            closeButton: true,
            closeOnClick: true,
        });
    }, []);

    const onCheckTxError = useCallback((txID: string, error: any) => {
        toastify.update(`CHECK_TRANSACTION_${txID}`, {
            render: error?.message || "Unknown error.",
            type: toastify.TYPE.ERROR,
            autoClose: 5000,
            isLoading: false,
            closeButton: true,
            closeOnClick: true,
        });
    }, []);

    return useMemo(
        () =>
            connexService && walletService
                ? new TransactionService(
                      connexService,
                      walletService,
                      GraphQLService.ws(),
                      onCheckTxRequest,
                      onCheckTxResponse,
                      onCheckTxError
                  )
                : null,
        [
            connexService,
            walletService,
            onCheckTxRequest,
            onCheckTxResponse,
            onCheckTxError,
        ]
    );
}

function useNftService(
    connexService: ConnexService | null,
    web3Service: Web3Service | null
) {
    return useMemo(
        () =>
            connexService && web3Service
                ? new NftService(connexService, web3Service)
                : null,
        [connexService, web3Service]
    );
}

function useSaleService(connexService: ConnexService | null) {
    return useMemo(
        () => (connexService ? new SaleService(connexService) : null),
        [connexService]
    );
}

function useAuctionService(connexService: ConnexService | null) {
    return useMemo(
        () => (connexService ? new AuctionService(connexService) : null),
        [connexService]
    );
}

function useDelegationService(
    connexService: ConnexService | null,
    web3Service: Web3Service
) {
    const userAddress = useRecoilValue(userAddressSelector);

    return useMemo(
        () =>
            connexService && userAddress
                ? new DelegationService(connexService, web3Service, userAddress)
                : null,
        [connexService, userAddress, web3Service]
    );
}

function useWeb3AuthService(connexService: ConnexService | null) {
    const network = useMemo(
        () => `${process.env.NEXT_PUBLIC_NETWORK!}net` as "mainnet" | "testnet",
        []
    );

    const redirectUrl = useMemo(
        () =>
            typeof window !== "undefined"
                ? new URL("/login-redirect", window.location.origin).href
                : null,
        []
    );

    // Trying to initialize the web3Auth library on sync1 will display a popup
    // and throw an error.
    const isSync1 = useMemo(
        () =>
            typeof navigator === "object"
                ? navigator.userAgent.includes("Sync/")
                : false,
        []
    );

    const onTxSignatureRequest = useCallback(
        async (_: Transaction, comment?: string) => {
            return confirm(comment || "Sign transaction?");
        },
        []
    );

    const web3AuthService = useMemo(
        () =>
            connexService && redirectUrl
                ? new Web3AuthService(
                      connexService,
                      process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
                      network,
                      redirectUrl,
                      onTxSignatureRequest,
                      isSync1
                  )
                : null,
        [connexService, isSync1, network, onTxSignatureRequest, redirectUrl]
    );

    useEffect(() => {
        web3AuthService?.init()?.catch(() => {});
    }, [web3AuthService]);

    return web3AuthService;
}

function useWalletService(
    connexService: ConnexService | null,
    web3AuthService: Web3AuthService | null
) {
    const { mutate: mutateUser } = useUserData();
    const setJwt = useSetRecoilState(jwtAtom);

    const { sdk } = useGraphQL();

    const onLogin = useCallback(
        async (result: LoginMutationResult["login"]) => {
            setJwt(result.jwt);
            await mutateUser({ user: result.user });
        },
        [mutateUser, setJwt]
    );

    const onLogout = useCallback(async () => {
        setJwt(undefined);
    }, [setJwt]);

    return useMemo(
        () =>
            connexService && web3AuthService
                ? new WalletService(
                      web3AuthService,
                      connexService,
                      sdk,
                      onLogin,
                      onLogout
                  )
                : null,
        [connexService, onLogin, onLogout, web3AuthService, sdk]
    );
}

function useBurnMintService(
    connexService: ConnexService | null,
    web3Service: Web3Service | null,
    saleService: SaleService | null,
    auctionService: AuctionService | null
) {
    return useMemo(
        () =>
            connexService && web3Service && saleService && auctionService
                ? new BurnMintService(
                      connexService,
                      web3Service,
                      saleService,
                      auctionService
                  )
                : null,
        [auctionService, connexService, saleService, web3Service]
    );
}

function useUserService(connexService: ConnexService | null) {
    return useMemo(
        () => (connexService ? new UserService(connexService) : null),
        [connexService]
    );
}

export default function BlockchainProvider(props: React.PropsWithChildren<{}>) {
    const abiService = useAbiService();
    const web3Service = useWeb3Service(abiService);
    const connexService = useConnexService(abiService);
    const exchangeService = useExchangeService(connexService, web3Service);
    const web3AuthService = useWeb3AuthService(connexService);
    const walletService = useWalletService(connexService, web3AuthService);
    const transactionService = useTransactionService(
        connexService,
        walletService
    );
    const nftService = useNftService(connexService, web3Service);
    const saleService = useSaleService(connexService);
    const auctionService = useAuctionService(connexService);
    const delegationService = useDelegationService(connexService, web3Service);
    const burnMintService = useBurnMintService(
        connexService,
        web3Service,
        saleService,
        auctionService
    );
    const userService = useUserService(connexService);

    return (
        <BlockchainContext.Provider
            value={{
                abiService,
                web3Service,
                connexService,
                exchangeService,
                transactionService,
                nftService,
                saleService,
                auctionService,
                delegationService,
                web3AuthService,
                walletService,
                burnMintService,
                userService,
            }}
            {...props}
        />
    );
}

export const useBlockchain = () => useContext(BlockchainContext);
