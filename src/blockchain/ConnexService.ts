import { ContractId } from "@/pages/api/get-contract/[name]";
import type { Connex } from "@vechain/connex";
import { Transaction } from "thor-devkit";
import { AbiItem } from "web3-utils";
import AbiService from "./AbiService";

export interface SignTransactionArgs {
    clauses: Connex.VM.Clause[];
    comment?: string;
    gas?: number;
}

type OnSignatureRequestHandler = (args: SignTransactionArgs) => void;
type OnSignatureResponseHandler = (res: Connex.Vendor.TxResponse) => void;
type OnSignatureErrorHandler = (error: unknown) => void;

export default class ConnexService {
    constructor(
        private readonly connex: Connex,
        private readonly abiService: AbiService,
        private readonly signerAddress?: string,
        private readonly onSignatureRequest?: OnSignatureRequestHandler,
        private readonly onSignatureResponse?: OnSignatureResponseHandler,
        private readonly onSignatureError?: OnSignatureErrorHandler
    ) {}

    async signCertificate(certificate: Connex.Vendor.CertMessage) {
        let cert = this.connex.vendor
            .sign("cert", certificate)
            .link(window.location.host);

        if (this.signerAddress) {
            cert = cert.signer(this.signerAddress);
        }

        return cert.request();
    }

    /**
     * This method will not work if the user is logged in using a social account.
     * Prefer to use `WalletService.signTransaction`.
     */
    async signTransaction({
        clauses,
        comment = "The fees of this transaction will be delegated to the marketplace.",
        gas,
    }: SignTransactionArgs) {
        let tx = this.connex.vendor.sign("tx", clauses);

        if (gas != null) {
            tx = tx.gas(gas);
        }

        if (this.signerAddress) {
            tx = tx.signer(this.signerAddress);
        }

        if (process.env.NEXT_PUBLIC_FEE_DELEGATION_URL) {
            tx = tx.delegate(process.env.NEXT_PUBLIC_FEE_DELEGATION_URL);
        }

        try {
            this.onSignatureRequest?.({ clauses, comment });
            const response = await tx.comment(comment).request();
            this.onSignatureResponse?.(response);
            return response;
        } catch (error) {
            this.onSignatureError?.(error);
            throw error;
        }
    }

    async getMethodsByABI(abi: AbiItem[], address: string) {
        const methods: Record<string, Connex.Thor.Account.Method> = {};

        for (const item of abi) {
            if (item.name && item.type === "function") {
                methods[item.name] = this.connex.thor
                    .account(address)
                    .method(item);
            }
        }

        return methods;
    }

    async getMethods(contractId: ContractId, address: string) {
        const abi = await this.abiService.getAbi(contractId);
        return this.getMethodsByABI(abi, address);
    }

    async waitForTransaction(txID: string, iterations = 5) {
        const ticker = this.connex.thor.ticker();

        for (let i = 0; ; i++) {
            if (i >= iterations) {
                throw new Error("Transaction not found.");
            }

            await ticker.next();

            const receipt = await this.connex.thor
                .transaction(txID)
                .getReceipt();

            if (receipt?.reverted) {
                throw new Error("The transaction has been reverted.");
            }

            if (receipt) {
                return receipt;
            }
        }
    }

    /**
     * @see https://github.com/vechain/connex/blob/c00bfc1abec3572c7d1df722bf8a7dfb14295102/packages/driver/src/driver.ts#L165
     */
    async estimateGas(clauses: Connex.VM.Clause[]) {
        let explainer = this.connex.thor.explain(clauses);

        if (this.signerAddress) {
            explainer = explainer.caller(this.signerAddress);
        }

        const output = await explainer.execute();
        const executionGas = output.reduce((sum, out) => sum + out.gasUsed, 0);

        const intrinsicGas = Transaction.intrinsicGas(
            clauses as Transaction.Clause[]
        );

        const leeway = executionGas > 0 ? 16000 : 0;

        return intrinsicGas + executionGas + leeway;
    }

    getLatestBlockId() {
        return this.connex.thor.status.head.id;
    }

    getGenesisBlockId() {
        return this.connex.thor.genesis.id;
    }

    getBlockchainStatus() {
        return this.connex.thor.status;
    }
}
