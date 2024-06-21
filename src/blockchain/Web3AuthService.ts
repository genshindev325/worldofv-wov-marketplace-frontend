import { LOGIN_PROVIDER_TYPE } from "@toruslabs/openlogin";
import { ExtraLoginOptions } from "@toruslabs/openlogin-utils";
import { ethers } from "@vechain/ethers";
import {
    ADAPTER_EVENTS,
    ADAPTER_STATUS,
    CHAIN_NAMESPACES,
    CONNECTED_EVENT_DATA,
    WALLET_ADAPTERS,
} from "@web3auth/base";
import { Web3AuthCore } from "@web3auth/core";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { blake2b256, Certificate, secp256k1, Transaction } from "thor-devkit";
import ConnexService from "./ConnexService";

export interface SignTransactionArgs {
    clauses: Connex.VM.Clause[];
    comment?: string;
    gas?: number;
}

type OnTxSignatureRequestHandler = (
    tx: Transaction,
    comment?: string
) => Promise<boolean>;

/**
 * @see https://blog.vechain.energy/web2-experience-in-web3-apps-8bb646ae6a4a
 */
export default class Web3AuthService {
    private static readonly TX_EXPIRATION_BLOCKS = 32;

    private readonly web3Auth: Web3AuthCore;
    private initialized: Promise<void> | undefined;

    constructor(
        private readonly connexService: ConnexService,
        private readonly clientId: string,
        private readonly network: "mainnet" | "testnet",
        private readonly redirectUrl: string,
        private readonly onTxSignatureRequest: OnTxSignatureRequestHandler,
        private readonly disabled: boolean
    ) {
        // We don't use dependency injection for this since we want to have
        // control over the initialization process.
        this.web3Auth = new Web3AuthCore({
            clientId: this.clientId,
            web3AuthNetwork: this.network,
            chainConfig: {
                chainNamespace: CHAIN_NAMESPACES.OTHER,
                displayName: "VeChain",
                ticker: "VET",
                tickerName: "VeChain",
            },
        });

        this.web3Auth.configureAdapter(
            new OpenloginAdapter({
                loginSettings: { mfaLevel: "none" },
                adapterSettings: {
                    network: this.network,
                    uxMode: "redirect",
                    redirectUrl: this.redirectUrl,
                    whiteLabel: {
                        name: "World of V",
                        logoLight: "http://worldofv.art/img/wov-logo.png",
                    },
                },
            })
        );
    }

    /**
     * Whenever you need to call one of the web3Auth methods you must await
     * this first, otherwise the call will result in an error.
     */
    async init() {
        if (!this.initialized) {
            if (this.disabled) {
                const error = new Error("Web3Auth is disabled.");
                this.initialized = new Promise((_, reject) => reject(error));
            } else {
                this.initialized = this.web3Auth.init();
            }
        }

        return this.initialized;
    }

    async getUserInfo() {
        await this.init();
        return this.web3Auth.getUserInfo();
    }

    async addOnLoginListener(handler: (data: CONNECTED_EVENT_DATA) => void) {
        this.web3Auth.on(ADAPTER_EVENTS.CONNECTED, handler);
    }

    async addOnLogoutListener(handler: (data: CONNECTED_EVENT_DATA) => void) {
        this.web3Auth.on(ADAPTER_EVENTS.DISCONNECTED, handler);
    }

    async isLoggedIn() {
        if (this.disabled) return false;
        await this.init();
        return this.web3Auth.status === ADAPTER_STATUS.CONNECTED;
    }

    async login(
        loginProvider: LOGIN_PROVIDER_TYPE,
        extraLoginOptions?: ExtraLoginOptions
    ) {
        await this.init();

        return this.web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider,
            extraLoginOptions,
        });
    }

    async logout() {
        await this.init();
        return this.web3Auth.logout();
    }

    async signCertificate(certMessage: Connex.Vendor.CertMessage) {
        const { address, privateKey } = await this.getWallet();

        const certificate: Certificate = {
            ...certMessage,
            domain: window.location.hostname,
            timestamp: Math.floor(Date.now() / 1000),
            signer: address,
        };

        const signature = secp256k1.sign(
            blake2b256(Certificate.encode(certificate)),
            Buffer.from(privateKey.slice(2), "hex")
        );

        return {
            signature: "0x" + signature.toString("hex"),
            annex: {
                domain: certificate.domain,
                signer: certificate.signer,
                timestamp: certificate.timestamp,
            },
        };
    }

    /**
     * This method will not work if the user is logged in using connex.
     * Prefer to use `WalletService.signTransaction`.
     */
    async signTransaction({ clauses, comment, gas }: SignTransactionArgs) {
        const { address, privateKey } = await this.getWallet();

        if (typeof gas !== "number") {
            gas = await this.connexService.estimateGas(clauses);
        }

        const chainTag = Number.parseInt(
            this.connexService.getGenesisBlockId().slice(-2),
            16
        );

        const transaction = new Transaction({
            chainTag,
            blockRef: this.connexService.getLatestBlockId().slice(0, 18),
            expiration: Web3AuthService.TX_EXPIRATION_BLOCKS,
            clauses: clauses as Transaction.Clause[],
            gas,
            gasPriceCoef: 0,
            dependsOn: null,
            nonce: Math.floor(Date.now() / 1000),
            reserved: {
                // Enable the fee delegation feature.
                features: process.env.NEXT_PUBLIC_FEE_DELEGATION_URL ? 1 : 0,
            },
        });

        const isAccepted = await this.onTxSignatureRequest(
            transaction,
            comment
        );

        if (!isAccepted) {
            throw new Error("User declined to sign the transaction.");
        }

        const signingHash = transaction.signingHash();

        const originSignature = secp256k1.sign(
            signingHash,
            Buffer.from(privateKey.slice(2), "hex")
        );

        if (process.env.NEXT_PUBLIC_FEE_DELEGATION_URL) {
            const sponsorSignature = await this.delegateTransaction(
                transaction,
                address,
                process.env.NEXT_PUBLIC_FEE_DELEGATION_URL
            );

            transaction.signature = Buffer.concat([
                originSignature,
                sponsorSignature,
            ]);
        } else {
            transaction.signature = originSignature;
        }

        const signedTransaction = `0x${transaction.encode().toString("hex")}`;
        const node = process.env.NEXT_PUBLIC_VECHAIN_NODE!.replace(/\/$/, "");

        const txRes = await fetch(`${node}/transactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ raw: signedTransaction }),
        });

        const { id } = await txRes.json();

        return { txid: id as string, signer: address };
    }

    private async delegateTransaction(
        transaction: Transaction,
        origin: string,
        delegationUrl: string
    ) {
        const raw = `0x${transaction.encode().toString("hex")}`;

        const res = await fetch(delegationUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ origin, raw }),
        });

        const { signature, error } = await res.json();

        // Sponsorship was rejected.
        if (error) {
            throw new Error(error);
        }

        return Buffer.from(signature.substr(2), "hex");
    }

    private async getWallet() {
        await this.init();

        const request = { method: "private_key" };
        const privateKey = await this.web3Auth.provider!.request(request);
        return new ethers.Wallet(privateKey as string);
    }
}
