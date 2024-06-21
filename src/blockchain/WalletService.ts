import { WOV_IDENTIFICATION_CERTIFICATE } from "@/constants/certificates";
import { LoginMutationResult, Sdk } from "@/generated/graphql";
import { LOGIN_PROVIDER_TYPE } from "@toruslabs/openlogin";
import { ExtraLoginOptions } from "@toruslabs/openlogin-utils";
import ConnexService from "./ConnexService";
import Web3AuthService from "./Web3AuthService";

export interface SignTransactionArgs {
    clauses: Connex.VM.Clause[];
    comment?: string;
    gas?: number;
}

type LoginHandler = (result: LoginMutationResult["login"]) => Promise<void>;
type LogoutHandler = () => Promise<void>;

export default class WalletService {
    constructor(
        private readonly web3AuthService: Web3AuthService,
        private readonly connexService: ConnexService,
        private readonly sdk: Sdk,
        private readonly onLogin: LoginHandler,
        private readonly onLogout: LogoutHandler
    ) {
        this.web3AuthService.addOnLoginListener(async () => {
            const certificate = await this.web3AuthService.signCertificate(
                WOV_IDENTIFICATION_CERTIFICATE
            );
            this.loginToBackend(certificate);
        });

        this.web3AuthService.addOnLogoutListener(async () => {
            await this.onLogout();
        });
    }

    async login(
        loginProvider: LOGIN_PROVIDER_TYPE | "connex",
        extraLoginOptions?: ExtraLoginOptions
    ) {
        await this.logout();

        if (loginProvider === "connex") {
            // When we use connex we can sign the certificate directly since the
            // login happens in a popup.
            const certificate = await this.connexService!.signCertificate(
                WOV_IDENTIFICATION_CERTIFICATE
            );
            await this.loginToBackend(certificate);
        } else {
            // When we log in using web3Auth we will be redirected to the
            // redirect page so this function will never return.
            await this.web3AuthService!.login(loginProvider, extraLoginOptions);
            throw new Error("Redirect failed.");
        }
    }

    async loginToBackend(certificate: Connex.Vendor.CertResponse) {
        const response = await this.sdk.Login(certificate);
        await this.onLogin(response.login);
        return response.login;
    }

    async logout() {
        const isLoggedInWithSocial = await this.web3AuthService.isLoggedIn();

        if (isLoggedInWithSocial) {
            await this.web3AuthService.logout();
        } else {
            await this.onLogout();
        }
    }

    async signTransaction(
        args: SignTransactionArgs
    ): Promise<Connex.Vendor.TxResponse> {
        const isLoggedInWithSocial = await this.web3AuthService.isLoggedIn();

        if (isLoggedInWithSocial) {
            return this.web3AuthService.signTransaction(args);
        } else {
            return this.connexService.signTransaction(args);
        }
    }
}
