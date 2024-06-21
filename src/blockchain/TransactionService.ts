import { BlockchainEventFragment } from "@/generated/graphql";
import { SubscriptionCheckTransaction } from "@/graphql/check-transaction.grapqhl";
import { Client as WebSocketClient } from "graphql-ws";
import ConnexService, { SignTransactionArgs } from "./ConnexService";
import WalletService from "./WalletService";

interface CheckTransactionArgs {
    txID: string;
    eventNames?: string[];
    eventCount?: number;
    timeout?: number;
    hideToast?: boolean;
}

export default class TransactionService {
    constructor(
        private readonly connexService: ConnexService,
        private readonly walletService: WalletService,
        private readonly ws: WebSocketClient,
        private readonly onCheckTxRequest?: (txID: string) => void,
        private readonly onCheckTxResponse?: (txID: string) => void,
        private readonly onCheckTxError?: (txID: string, error: unknown) => void
    ) {}

    async checkTxOnBlockchain(txID: string, iterations?: number) {
        try {
            this.onCheckTxRequest?.(txID);
            await this.connexService.waitForTransaction(txID, iterations);
            return this.onCheckTxResponse?.(txID);
        } catch (error) {
            this.onCheckTxError?.(txID, error);
        }
    }

    async checkTransaction({
        txID,
        eventNames,
        eventCount = 1,
        timeout = 30000 + eventCount * 10000,
    }: CheckTransactionArgs) {
        return new Promise<BlockchainEventFragment[]>(
            async (resolve, reject) => {
                this.onCheckTxRequest?.(txID);

                let unsubscribe: () => void;
                let timeoutId: NodeJS.Timeout;
                let events: BlockchainEventFragment[] = [];

                timeoutId = setTimeout(async () => {
                    try {
                        unsubscribe();
                        await this.connexService.waitForTransaction(txID, 1);
                        throw new Error(
                            "The transaction has been confirmed but not processed."
                        );
                    } catch (error) {
                        this.onCheckTxError?.(txID, error);
                        reject(error);
                    }
                }, timeout);

                unsubscribe = this.ws.subscribe<{
                    event: BlockchainEventFragment;
                }>(
                    {
                        query: SubscriptionCheckTransaction,
                        variables: { txID, eventNames },
                    },
                    {
                        complete: () => {
                            clearTimeout(timeoutId);
                        },

                        next: ({ data }) => {
                            events.push(data!.event);

                            if (events.length >= eventCount) {
                                unsubscribe();
                                this.onCheckTxResponse?.(txID);
                                resolve(events);
                            }
                        },

                        error: (error) => {
                            this.onCheckTxError?.(txID, error);
                            reject(error);
                        },
                    }
                );
            }
        );
    }

    async runTransaction({
        clauses,
        comment,
        gas,
        ...checkTransactionArgs
    }: SignTransactionArgs & Omit<CheckTransactionArgs, "txID">) {
        const tx = await this.walletService.signTransaction({
            clauses,
            comment,
            gas,
        });

        return this.checkTransaction({
            txID: tx.txid,
            ...checkTransactionArgs,
        });
    }

    async runTxOnBlockchain({
        clauses,
        comment,
        gas,
        iterations,
    }: SignTransactionArgs & { iterations?: number }) {
        const tx = await this.walletService.signTransaction({
            clauses,
            comment,
            gas,
        });

        return this.checkTxOnBlockchain(tx.txid, iterations);
    }
}
