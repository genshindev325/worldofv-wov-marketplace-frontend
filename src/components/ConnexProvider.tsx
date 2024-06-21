import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { GraphQLService } from "@/services/GraphQLService";
import { userAddressSelector } from "@/store/selectors";
import type { Connex as TConnex } from "@vechain/connex";
import BigNumber from "bignumber.js";
import localforage from "localforage";
import _ from "lodash";
import moment from "moment";
import dynamic from "next/dynamic";
import React from "react";
import { toast as toastify } from "react-toastify";
import { useRecoilValue } from "recoil";
import { thorify } from "thorify";
import { OFFER_ALLOWANCE_WEI, OFFER_DURATION } from "../constants/blockchain";
import ZERO_ADDRESS from "../constants/zeroAddress";
import { SubscriptionCheckTransaction } from "../graphql/check-transaction.grapqhl";
import { ContractId } from "../pages/api/get-contract/[name]";
import { AuctionCurrency, OfferCurrency } from "../types/Currencies";
import { isSameAddress } from "../utils/isSameAddress";
import { Balance } from "./BalanceProvider";
const Web3 = require("web3"); // Recommend using require() instead of import here

//#region Typings
export interface OfferTarget {
    smartContractAddress: string;
    tokenId?: string;
    editionId?: string;
}

export interface CreateOfferParams extends OfferTarget {
    amount: BigNumber;
    currency: OfferCurrency; // TODO: not sure if this goes here or on the OfferTarget
    previousOfferId?: string;
}

export interface CancelOfferData extends OfferTarget {
    offerId: string;
}

export interface AcceptOfferParams extends OfferTarget {
    offerId: string;
    useEditionId: string;
    saleId?: string;
    auctionId?: string;
}

export interface MintTokenParams {
    metadataHash: string;
    fileHash: string;
    editionsCount: number;
    royalty?: number | null;
    tokenName: string;
    collectionName?: string | null;
}

export interface BurnMintTokenInfo {
    tokenId: string;
    saleId?: string | null;
    auctionId?: string | null;
}

export interface BurnMintWithCooldownParams {
    smartContractAddress: string;
    burnContractAddress: string;
    cooldownContractAddress: string;
    tokensToBurn: BurnMintTokenInfo[];
    tokensToOwn: BurnMintTokenInfo[];
}

export interface MintWithCooldownParams {
    smartContractAddress: string;
    cooldownContractAddress: string;
    tokensToOwn: BurnMintTokenInfo[];
}

export interface BurnMintParams {
    smartContractAddress: string;
    burnContractAddress: string;
    tokensToBurn: BurnMintTokenInfo[];
}

export interface BurnMintAndPayParams extends BurnMintParams {
    costPerMint: string;
}

interface TransferNFTParams {
    from: string;
    to: string;
    tokenId: string;
    smartContractAddress: string;
}

interface FeeDelegationOptions {
    payer?: string;
    signer?: string;
    comment?: string;
    hideToast?: boolean;
}

interface CheckTransactionOptions {
    txID: string;
    txOrigin?: string;
    eventName?: string;
    eventCount?: number;
    clauseIndex?: number;
    TIMEOUT?: number;
    MAX_ITERATION?: number;
    toast?: {
        enabled: boolean;
        pending?: string;
        success?: string;
        error?: string;
    };
}

export interface UnstakeParams {
    stakingContractAddress: string;
    tokenId: string;
}

export interface StakeParams extends UnstakeParams {
    smartContractAddress: string;
    saleId?: string;
    auctionId?: string;
}

export interface StakingInfo {
    minimumDuration: number;
    periodFinish: number;
    lastUpdateTime: number;
    rewardsDuration: number;
    stakedCount: number;
    rewardRate: BigNumber;
    rewardPerToken: BigNumber;
    apy: number;
}

export interface TokenStakingInfo {
    virtualStaked: BigNumber;
    earnedPerToken: BigNumber;
    startTime: number;
    endTime: number;
    isExit: number;
    ticketOwner: BigNumber;
}

export interface UserStakingInfo {
    earned: BigNumber;
    stakedCount: number;
}

export interface BurnMintInfo {
    totalCount: number;
    mintedCount: number;
}

export interface BurnMintWithCooldownInfo extends BurnMintInfo {
    cooldownDuration: number | null;
}

interface Contract {
    [methodName: string]: any;
}

interface ConnexContextState {
    connex?: TConnex;
    transfer: (
        from: string,
        to: string,
        tokenId: string,
        smartContractAddress: string
    ) => Promise<any>;
    mintToken: (...data: MintTokenParams[]) => Promise<any>;
    burnMintWithCooldown: (data: BurnMintWithCooldownParams) => Promise<any>;
    mintWithCooldown: (data: MintWithCooldownParams) => Promise<any>;
    burnMint: (data: BurnMintParams) => Promise<any>;
    burnMintAndPay: (data: BurnMintAndPayParams) => Promise<any>;
    burn: (
        smartContractAddress: string,
        tokenId: string,
        ownerAddress: string,
        selectedEditionId: string
    ) => Promise<any>;
    checkTransaction: (options: CheckTransactionOptions) => Promise<any>;
    checkTransactionOnBlockchain: (
        options: CheckTransactionOptions
    ) => Promise<any>;
    checkTransactionByBackend: (
        options: CheckTransactionOptions
    ) => Promise<any>;
    createBidAuction: (
        tokenId: string,
        price: string | BigNumber,
        startDate: Date | number,
        endDate: Date | number,
        addressVIP180?: string,
        smartContractAddress?: string
    ) => Promise<any>;
    bid: (
        auctionId: number,
        tokenId: string | number,
        price: string | BigNumber,
        payment: AuctionCurrency,
        smartContractAddress: string
    ) => Promise<any>;
    settleAuction: (
        auctionId: number,
        tokenId: string,
        smartContractAddress: string
    ) => Promise<any>;
    cancelAuction: (
        auctionId: number,
        tokenId: string,
        smartContractAddress: string
    ) => Promise<any>;
    // Get the offer fee for a specific currency contract.
    getOfferPaymentFee: (
        paymentContractAddress: string
    ) => Promise<number | undefined>;
    // Get the offer fee for a specific NFT contract.
    getOfferCollectionFee: (
        nftContractAddress: string
    ) => Promise<number | undefined>;
    getBalance: (address: string) => Promise<Balance | undefined>;
    exchangeVETForVVET: (amountWEI: BigNumber) => Promise<any>;
    exchangeVVETForVET: (amountWEI: BigNumber) => Promise<any>;
    createOffer: (...data: CreateOfferParams[]) => Promise<any>;
    cancelOffer: (...data: CancelOfferData[]) => Promise<any>;
    acceptOffer: (data: AcceptOfferParams) => Promise<any>;
    v2: {
        transfer: (tokens: TransferNFTParams[]) => Promise<any>;
    };
    stake: (...params: StakeParams[]) => Promise<any>;
    unstake: (...params: UnstakeParams[]) => Promise<any>;
    claim: (...params: UnstakeParams[]) => Promise<any>;
    getStakingInfo: (stakingContractAddress: string) => Promise<StakingInfo>;
    getCollectionStakedPercentage: (
        stakingContractAddress: string,
        collectionContractAddress: string
    ) => Promise<number>;
    getUserStakingInfo: (
        stakingContractAddress: string,
        userAddress: string
    ) => Promise<UserStakingInfo>;
    getTokenStakingInfo: (
        stakingContractAddress: string,
        tokenId: string
    ) => Promise<TokenStakingInfo>;
    getBurnMintWithCooldownInfo: (
        smartContractAddress: string
    ) => Promise<BurnMintWithCooldownInfo>;
    getBurnMintInfo: (burnContractAddress: string) => Promise<BurnMintInfo>;
    isWhitelistedForBurn: (
        smartContractAddress: string,
        userAddress: string
    ) => Promise<boolean>;
    getUserTokenCount: (
        smartContractAddress: string,
        userAddress: string
    ) => Promise<number>;
}
//#endregion

const ConnexContext = React.createContext<ConnexContextState>({} as any);

/**
 * @deprecated Use `BlockchainProvider` when possible.
 */
const ConnexProvider: React.FC<React.PropsWithChildren<any>> = ({
    children,
    buildId,
}) => {
    const walletAddress = useRecoilValue(userAddressSelector);

    const {
        walletService,
        connexService,
        abiService,
        saleService,
        auctionService,
    } = useBlockchain();

    const connex = React.useRef<TConnex | undefined>();
    const web3 = React.useRef<typeof Web3 | undefined>();

    const wovContract = React.useRef<Contract>();
    const tokenContract = React.useRef<Contract>();
    const bidAuctionContract = React.useRef<Contract>();
    const offerContract = React.useRef<Contract>();
    const wrappedVETContract = React.useRef<Contract>();
    const veusdContract = React.useRef<Contract>();
    const shaContract = React.useRef<Contract>();
    const vseaContract = React.useRef<Contract>();

    const { initialized, setInitialized } = React.useMemo(() => {
        let setInitialized: (() => void) | undefined;
        const initialized = new Promise<void>((res) => (setInitialized = res));
        return { initialized, setInitialized: setInitialized! };
    }, []);

    React.useEffect(
        () => {
            if (buildId) {
                if (!connexService) return;

                const initConnex = async () => {
                    if (process.browser) {
                        const { Connex } = await import("@vechain/connex");

                        const network =
                            (process.env.NEXT_PUBLIC_NETWORK as
                                | "main"
                                | "test") || "main";

                        const node =
                            process.env.NEXT_PUBLIC_VECHAIN_NODE ||
                            `https://${network}net.veblocks.net`;

                        connex.current = new Connex({ node, network });
                        web3.current = thorify(new Web3(), node);

                        // Remove cached contract of an old build
                        const cachedKeys = await localforage.keys();
                        for (const key of cachedKeys) {
                            if (!key.startsWith(`${buildId}_`)) {
                                await localforage.removeItem(key);
                            }
                        }

                        // Register contracts
                        wovContract.current = await registerContract(
                            process.env
                                .NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS!,
                            ContractId.WorldOfVGovernanceToken
                        );

                        tokenContract.current = await registerContract(
                            process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS!,
                            ContractId.WorldOfVOpenMarketplaceToken
                        );

                        bidAuctionContract.current = await registerContract(
                            process.env
                                .NEXT_PUBLIC_BID_AUCTION_CONTRACT_ADDRESS!,
                            ContractId.WorldOfVBidAuction
                        );

                        offerContract.current = await registerContract(
                            process.env.NEXT_PUBLIC_OFFER_CONTRACT_ADDRESS!,
                            ContractId.WorldOfVOffer
                        );

                        wrappedVETContract.current = await registerContract(
                            process.env
                                .NEXT_PUBLIC_WRAPPED_VET_CONTRACT_ADDRESS!,
                            ContractId.WrappedVET
                        );

                        if (process.env.NEXT_PUBLIC_NETWORK !== "test") {
                            veusdContract.current = await registerContract(
                                process.env.NEXT_PUBLIC_VEUSD_CONTRACT_ADDRESS!,
                                ContractId.VTHOContract
                            );

                            shaContract.current = await registerContract(
                                process.env.NEXT_PUBLIC_SHA_CONTRACT_ADDRESS!,
                                ContractId.VTHOContract
                            );

                            vseaContract.current = await registerContract(
                                process.env.NEXT_PUBLIC_VSEA_CONTRACT_ADDRESS!,
                                ContractId.VTHOContract
                            );
                        }
                        setInitialized!();
                        console.log("Connex methods initialized");
                    }
                };

                initConnex();
            }
        },
        [buildId, connexService] // eslint-disable-line react-hooks/exhaustive-deps
    );

    //#region Contract registration
    const registerContract = async (
        contractAddress: string,
        contractId: number
    ): Promise<Contract | undefined> => {
        return connexService!.getMethods(contractId, contractAddress);
    };
    //#endregion

    //#region Fee delegation
    const feeDelegation = (clauses: Connex.VM.Clause | Connex.VM.Clause[]) => {
        const call = ({
            comment = "The fees of this transaction will be delegated to the marketplace.",
        }: FeeDelegationOptions) => {
            clauses = _.isArray(clauses) ? clauses : [clauses];
            const data = walletService!.signTransaction({ clauses, comment });
            return data;
        };

        return { call };
    };
    //#endregion

    //#region Wait for transaction methods
    const checkTransaction = async ({
        txID,
        txOrigin,
        eventName,
        clauseIndex,
        TIMEOUT = 30000,
        MAX_ITERATION = 1,
        toast,
    }: CheckTransactionOptions) => {
        // Check first using backend, then on blockchain
        const promise = checkTransactionByBackend({
            txID,
            txOrigin,
            eventName,
            clauseIndex,
            TIMEOUT,
        }).catch(() => {
            return checkTransactionOnBlockchain({
                txID,
                txOrigin,
                MAX_ITERATION,
            });
        });

        if (toast?.enabled) {
            return toastify.promise(promise, {
                pending: toast.pending || "The transaction is pending…",
                success:
                    toast.success ||
                    "You have successfully cancelled your transaction.",
                error: {
                    render: ({ data }) =>
                        toast.error ||
                        (data as any)?.message ||
                        "An error occurred while processing your request",
                },
            });
        }

        return promise;
    };

    const checkTransactionOnBlockchain = async ({
        txID,
        txOrigin,
        MAX_ITERATION = 5,
        toast,
    }: CheckTransactionOptions) => {
        const promise = new Promise(async (resolve, reject) => {
            if (connex.current) {
                const ticker = connex.current.thor.ticker();

                for (let i = 0; i < MAX_ITERATION; i++) {
                    await ticker.next();

                    const receipt = await connex.current.thor
                        .transaction(txID)
                        .getReceipt();

                    if (receipt) {
                        if (receipt.reverted) {
                            reject({
                                message: "The transaction has been reverted",
                                tx: receipt,
                            });
                        }

                        resolve({
                            tx: receipt,
                        });
                    }
                }
            }

            reject({
                tx: {
                    meta: {
                        txID,
                        txOrigin,
                    },
                },
            });
        });

        if (toast?.enabled) {
            return toastify.promise(promise, {
                pending: toast.pending || "The transaction is pending…",
                success:
                    toast.success ||
                    "You have successfully cancelled your transaction.",
                error: {
                    render: ({ data }) =>
                        toast.error ||
                        (data as any)?.message ||
                        "An error occurred while processing your request",
                },
            });
        }
        return promise;
    };

    const checkTransactionByBackend = async ({
        txID,
        eventCount = 1,
        eventName,
        clauseIndex,
        TIMEOUT = 30000,
        toast,
    }: CheckTransactionOptions) => {
        let unsubscribe = () => {};
        let timeoutId: NodeJS.Timeout;

        const promise = new Promise(async (resolve, reject) => {
            let currentEventCount = 0;

            unsubscribe = GraphQLService.ws().subscribe(
                {
                    query: SubscriptionCheckTransaction,
                    variables: { txID },
                },
                {
                    next: (data) => {
                        const eventLog = data.data?.event as any;

                        if (
                            _.isNil(eventName) ||
                            eventName === eventLog?.event
                        ) {
                            if (
                                _.isNil(clauseIndex) ||
                                clauseIndex === eventLog.meta.clauseIndex
                            ) {
                                currentEventCount++;

                                if (currentEventCount >= eventCount) {
                                    resolve(eventLog);
                                }
                            }
                        }
                    },
                    error: reject,
                    complete: () => undefined,
                }
            );

            if (TIMEOUT > 0) {
                timeoutId = setTimeout(
                    () =>
                        reject(
                            `Transaction check timed out after ${
                                TIMEOUT / 1000
                            } seconds`
                        ),
                    TIMEOUT
                );
            }
        }).finally(() => {
            clearTimeout(timeoutId);
            unsubscribe();
        });

        if (toast?.enabled) {
            return toastify.promise(promise, {
                pending: toast.pending || "The transaction is pending…",
                success:
                    toast.success ||
                    "You have successfully cancelled your transaction.",
                error: {
                    render: ({ data }) =>
                        toast.error ||
                        (data as any)?.message ||
                        "An error occurred while processing your request",
                },
            });
        }

        return promise;
    };
    //#endregion

    const transfer = async (
        from: string,
        to: string,
        tokenId: string,
        smartContractAddress: string
    ): Promise<any> => {
        const contract = await registerContract(
            smartContractAddress,
            ContractId.StandardNFT
        );

        if (contract) {
            const clause = contract.safeTransferFrom.asClause(
                from,
                to,
                tokenId
            );

            return feeDelegation(clause).call({
                comment: `Transfer token to ${to}`,
            });
        }
    };

    const burn = async (
        smartContractAddress: string,
        tokenId: string,
        ownerAddress: string,
        selectedEditionId: string
    ): Promise<any> => {
        const DEAD_LIST = [
            process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS,
            process.env.NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS,
            process.env.NEXT_PUBLIC_GENESIS_SPECIAL_CONTRACT_ADDRESS,
            process.env.NEXT_PUBLIC_VEHASHES_CONTRACT_ADDRESS,
        ];

        if (
            DEAD_LIST.some((addr) => isSameAddress(smartContractAddress, addr))
        ) {
            // If it's an ART token (ERC1155) or it's a contract listed above,
            // transfer it to the dead address.
            return transfer(
                ownerAddress,
                process.env.NEXT_PUBLIC_DEAD_ADDRESS!,
                selectedEditionId,
                smartContractAddress
            );
        } else {
            // Otherwise, if it's a PFP collection token (ERC721), then
            // burn it using the burn function from the minting contract.
            const contract = await registerContract(
                smartContractAddress,
                ContractId.StandardNFT
            );

            if (contract) {
                const clause = contract.burn.asClause(tokenId);

                return feeDelegation(clause).call({
                    comment: "Burn token",
                });
            }
        }
    };

    const mintToken = async (...data: MintTokenParams[]) => {
        if (tokenContract.current) {
            const clauses = [];
            for (const item of data) {
                clauses.push(
                    tokenContract.current.mint.asClause(
                        item.metadataHash,
                        item.fileHash,
                        item.collectionName || "",
                        item.tokenName,
                        item.editionsCount,
                        item.royalty || 0
                    )
                );
            }

            const tx = await feeDelegation(clauses).call({
                comment:
                    data.length > 1
                        ? `Mint of ${data.length} tokens`
                        : `Mint of "${data[0].tokenName}" token`,
            });

            return { ...tx, clauseCount: clauses.length };
        }
    };

    const createCancelSaleClause = ({
        tokenId,
        auctionId,
        saleId,
        smartContractAddress,
    }: {
        smartContractAddress: string;
        tokenId: string;
        saleId?: string | null;
        auctionId?: string | null;
    }) => {
        if (auctionId) {
            return auctionService!.cancel({
                auctionId,
                smartContractAddress,
                tokenId,
            });
        } else if (saleId) {
            return saleService!.cancel({
                saleId,
                smartContractAddress,
                tokenId,
            });
        }
    };

    const burnMintWithCooldown = async ({
        smartContractAddress,
        burnContractAddress,
        cooldownContractAddress,
        tokensToBurn,
        tokensToOwn,
    }: BurnMintWithCooldownParams) => {
        const clauses = [];

        const burnContract = await registerContract(
            burnContractAddress,
            ContractId.StandardNFT
        );

        const cooldownContract = await registerContract(
            cooldownContractAddress,
            ContractId.StandardNFT
        );

        for (const params of tokensToBurn) {
            const clause = await createCancelSaleClause({
                ...params,
                smartContractAddress: burnContractAddress,
            });
            if (clause) clauses.push(clause);
        }

        for (const params of tokensToOwn) {
            const clause = await createCancelSaleClause({
                ...params,
                smartContractAddress: cooldownContractAddress,
            });
            if (clause) clauses.push(clause);
        }

        for (const { tokenId } of tokensToBurn) {
            clauses.push(
                burnContract!.approve.asClause(smartContractAddress, tokenId)
            );
        }

        for (const { tokenId } of tokensToOwn) {
            clauses.push(
                cooldownContract!.approve.asClause(
                    smartContractAddress,
                    tokenId
                )
            );
        }

        const burnMintContract = await registerContract(
            smartContractAddress,
            ContractId.BurnMintingPFP
        );

        clauses.push(
            burnMintContract!.mintWithBurn.asClause(
                _.random(),
                burnContractAddress,
                tokensToBurn.map((t) => t.tokenId),
                cooldownContractAddress,
                tokensToOwn.map((t) => t.tokenId)
            )
        );

        const count = Math.min(tokensToBurn.length, tokensToOwn.length);
        const tx = await feeDelegation(clauses).call({
            comment: `Mint of ${count} NFTs.`,
        });

        return { ...tx, clauseCount: clauses.length };
    };

    const mintWithCooldown = async ({
        smartContractAddress,
        cooldownContractAddress,
        tokensToOwn,
    }: MintWithCooldownParams) => {
        const clauses = [];

        for (const params of tokensToOwn) {
            const clause = await createCancelSaleClause({
                ...params,
                smartContractAddress,
            });
            if (clause) clauses.push(clause);
        }

        const abi = {
            inputs: [
                {
                    internalType: "uint256[]",
                    name: "tokenIdOne",
                    type: "uint256[]",
                },
            ],
            name: "mintVoucher",
            outputs: [],
            stateMutability: "payable",
            type: "function",
        };

        clauses.push(
            connex
                .current!.thor.account(cooldownContractAddress)
                .method(abi)
                .asClause(tokensToOwn.map((t) => t.tokenId))
        );

        const tx = await feeDelegation(clauses).call({
            comment: "Mint of 1 Voucher.",
        });

        return { ...tx, clauseCount: clauses.length };
    };

    const burnMint = async ({
        smartContractAddress,
        burnContractAddress,
        tokensToBurn,
    }: BurnMintParams) => {
        const clauses = [];

        const nftContract = await registerContract(
            smartContractAddress,
            ContractId.StandardNFT
        );

        const burnContract = await registerContract(
            burnContractAddress,
            ContractId.PFPBurning
        );

        for (const params of tokensToBurn) {
            if (params.auctionId || params.saleId) {
                clauses.push(
                    await createCancelSaleClause({
                        ...params,
                        smartContractAddress,
                    })
                );
            }
        }

        for (const { tokenId } of tokensToBurn) {
            clauses.push(
                nftContract!.approve.asClause(burnContractAddress, tokenId)
            );
        }

        clauses.push(
            burnContract!.mintWithBurn.asClause(
                _.random(),
                smartContractAddress,
                tokensToBurn.map((t) => t.tokenId),
                ZERO_ADDRESS,
                []
            )
        );

        const tx = await feeDelegation(clauses).call({
            comment: `Mint of ${tokensToBurn.length} NFTs.`,
        });

        return { ...tx, clauseCount: clauses.length };
    };

    const burnMintAndPay = async ({
        smartContractAddress,
        burnContractAddress,
        tokensToBurn,
        costPerMint,
    }: BurnMintAndPayParams) => {
        const clauses = [];

        const nftContract = await registerContract(
            smartContractAddress,
            ContractId.StandardNFT
        );

        const burnContract = await registerContract(
            burnContractAddress,
            ContractId.PFPBurning
        );

        for (const params of tokensToBurn) {
            if (params.auctionId || params.saleId) {
                clauses.push(
                    await createCancelSaleClause({
                        ...params,
                        smartContractAddress,
                    })
                );
            }
        }

        for (const { tokenId } of tokensToBurn) {
            clauses.push(
                nftContract!.approve.asClause(burnContractAddress, tokenId)
            );
        }

        const formatted = new BigNumber(tokensToBurn.length)
            .multipliedBy(new BigNumber(costPerMint))
            .toFormat({
                groupSeparator: "",
            });

        clauses.push(
            burnContract!.mintWithBurn.value(formatted).asClause(
                _.random(),
                smartContractAddress,
                tokensToBurn.map((t) => t.tokenId),
                ZERO_ADDRESS,
                []
            )
        );

        const tx = await feeDelegation(clauses).call({
            comment: `Mint of ${tokensToBurn.length} NFTs.`,
        });

        return { ...tx, clauseCount: clauses.length };
    };
    //#region Bid Auction
    const createBidAuction = async (
        tokenId: string,
        reservePrice: string | BigNumber,
        startDate: Date | number,
        endDate: Date | number,
        addressVIP180: string = ZERO_ADDRESS,
        smartContractAddress: string = process.env
            .NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS!
    ): Promise<any> => {
        if (tokenContract.current && bidAuctionContract.current) {
            const isVIP180 = addressVIP180 !== ZERO_ADDRESS;
            const duration = moment(endDate).diff(startDate, "seconds");

            reservePrice = new BigNumber(reservePrice)
                .multipliedBy(10 ** 18)
                .toFormat({ groupSeparator: "" });

            startDate = _.isDate(startDate)
                ? Number((startDate.getTime() / 1000).toFixed(0))
                : startDate;

            const contract = await registerContract(
                smartContractAddress,
                ContractId.StandardNFT
            );

            const allowanceClause = contract!.approve.asClause(
                process.env.NEXT_PUBLIC_BID_AUCTION_CONTRACT_ADDRESS,
                tokenId
            );

            const createAuctionClause =
                bidAuctionContract.current.createTokenAuction.asClause(
                    smartContractAddress,
                    tokenId,
                    reservePrice,
                    startDate,
                    duration,
                    isVIP180,
                    addressVIP180
                );

            return feeDelegation([allowanceClause, createAuctionClause]).call({
                comment: `Put token ${tokenId} on auction`,
            });
        }
    };

    //#region Bid Methods
    const bidWithVET = async (
        auctionId: number,
        tokenId: number,
        price: string,
        smartContractAddress: string
    ): Promise<any> => {
        if (bidAuctionContract.current) {
            const clause = bidAuctionContract.current.bid
                .value(price)
                .asClause(auctionId, smartContractAddress, tokenId, price);

            return feeDelegation(clause).call({
                comment: `Bidding in VET for token ${tokenId}`,
            });
        }
    };

    const bidWithWOV = async (
        auctionId: number,
        tokenId: number,
        price: string | BigNumber,
        smartContractAddress: string
    ): Promise<any> => {
        if (wovContract.current && bidAuctionContract.current) {
            const allowanceClause =
                wovContract.current.increaseAllowance.asClause(
                    process.env.NEXT_PUBLIC_BID_AUCTION_CONTRACT_ADDRESS,
                    price
                );

            const clause = bidAuctionContract.current.bid
                .value(0)
                .asClause(auctionId, smartContractAddress, tokenId, price);

            return feeDelegation([allowanceClause, clause]).call({
                comment: `Bidding in WoV for token ${tokenId}`,
            });
        }
    };

    const bid = async (
        auctionId: number,
        tokenId: string | number,
        price: string | BigNumber,
        payment: AuctionCurrency,
        smartContractAddress: string = process.env
            .NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS!
    ): Promise<any> => {
        tokenId = Number(tokenId);

        const priceAsWei: string = new BigNumber(price)
            .multipliedBy(10 ** 18)
            .toFormat({ groupSeparator: "" });

        switch (payment) {
            case "VET":
                return bidWithVET(
                    auctionId,
                    tokenId,
                    priceAsWei,
                    smartContractAddress
                );
            case "WoV":
                return bidWithWOV(
                    auctionId,
                    tokenId,
                    priceAsWei,
                    smartContractAddress
                );
        }
    };
    //#endregion

    const settleAuction = async (
        auctionId: number,
        tokenId: string,
        smartContractAddress: string = process.env
            .NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS!
    ): Promise<any> => {
        if (bidAuctionContract.current) {
            const clause = bidAuctionContract.current.executeSale.asClause(
                auctionId,
                smartContractAddress,
                tokenId
            );

            return feeDelegation(clause).call({
                comment: `Settling auction #${auctionId} for token ${tokenId}`,
            });
        }
    };

    const cancelAuction = async (
        auctionId: number,
        tokenId: string,
        smartContractAddress: string = process.env
            .NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS!
    ): Promise<any> => {
        if (bidAuctionContract.current) {
            const clause = await auctionService!.cancel({
                auctionId: auctionId.toString(),
                tokenId,
                smartContractAddress,
            });

            return feeDelegation(clause).call({
                comment: `Cancelling auction #${auctionId} for token ${tokenId}`,
            });
        }
    };

    const createCancelOfferClause = ({
        smartContractAddress,
        tokenId,
        editionId,
        offerId,
    }: CancelOfferData) => {
        if (!walletAddress || !offerContract.current) {
            return;
        }

        if (editionId) {
            return offerContract.current.CloseTokenOfferToToken.asClause(
                offerId,
                smartContractAddress,
                editionId
            );
        }

        if (tokenId) {
            return offerContract.current.CloseTokenOfferToGlobal.asClause(
                offerId,
                smartContractAddress,
                tokenId
            );
        }

        return offerContract.current.CloseTokenOfferToExternalCollection.asClause(
            offerId,
            smartContractAddress
        );
    };

    const cancelOffer = async (...data: CancelOfferData[]) => {
        if (
            !walletAddress ||
            !wrappedVETContract.current ||
            !offerContract.current
        ) {
            return;
        }

        const clauses = data.map(createCancelOfferClause);

        const tx = await feeDelegation(clauses).call({
            comment:
                clauses.length > 1
                    ? `Canceling ${clauses.length} offers.`
                    : `Canceling an offer.`,
        });

        return { ...tx, clauseCount: clauses.length };
    };

    const acceptOffer = async ({
        smartContractAddress,
        tokenId,
        editionId,
        offerId,
        useEditionId,
        saleId,
        auctionId,
    }: AcceptOfferParams) => {
        const clauses = [];

        if (saleId || auctionId) {
            clauses.push(
                await createCancelSaleClause({
                    smartContractAddress,
                    tokenId: useEditionId,
                    saleId,
                    auctionId,
                })
            );
        }

        const tokenContract = await registerContract(
            smartContractAddress,
            ContractId.StandardNFT
        );

        clauses.push(
            tokenContract!.approve.asClause(
                process.env.NEXT_PUBLIC_OFFER_CONTRACT_ADDRESS,
                useEditionId
            )
        );

        if (editionId) {
            clauses.push(
                offerContract.current!.acceptTokenBuyOffer.asClause(
                    offerId,
                    smartContractAddress,
                    useEditionId
                )
            );
        } else if (tokenId) {
            clauses.push(
                offerContract.current!.acceptGlobalBuyOffer.asClause(
                    offerId,
                    smartContractAddress,
                    tokenId,
                    useEditionId
                )
            );
        } else {
            clauses.push(
                offerContract.current!.acceptCollectionBuyOffer.asClause(
                    offerId,
                    smartContractAddress,
                    useEditionId
                )
            );
        }

        return feeDelegation(clauses).call({
            comment: `Accepting an offer.`,
        });
    };

    const createOffer = async (...data: CreateOfferParams[]) => {
        if (
            walletAddress == null ||
            wovContract.current == null ||
            wrappedVETContract.current == null ||
            offerContract.current == null
        ) {
            return;
        }

        const clauses = [];

        for (const item of data) {
            const {
                smartContractAddress,
                tokenId,
                editionId,
                amount,
                currency,
                previousOfferId,
            } = item;

            if (previousOfferId) {
                clauses.push(
                    createCancelOfferClause({
                        smartContractAddress,
                        tokenId,
                        editionId,
                        offerId: previousOfferId,
                    })
                );
            }

            const amountWei = amount.toFormat({ groupSeparator: "" });

            const currencyContracts: Record<OfferCurrency, Contract> = {
                ["vVET"]: wrappedVETContract,
                ["WoV"]: wovContract,
            };

            const currencyContractAddresses: Record<
                OfferCurrency,
                string | undefined
            > = {
                ["vVET"]: process.env.NEXT_PUBLIC_WRAPPED_VET_CONTRACT_ADDRESS,
                ["WoV"]:
                    process.env
                        .NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS,
            };

            const currencyContract = currencyContracts[currency];
            const currencyContractAddress = currencyContractAddresses[currency];

            if (currencyContract == null || currencyContractAddresses == null) {
                throw new Error("Currency contract is undefined");
            }

            const { data: rawAllowance } =
                await currencyContract.current.allowance.call(
                    walletAddress,
                    process.env.NEXT_PUBLIC_OFFER_CONTRACT_ADDRESS
                );

            const allowance = new BigNumber(rawAllowance);

            if (allowance.lt(OFFER_ALLOWANCE_WEI)) {
                clauses.push(
                    currencyContract.current.approve.asClause(
                        process.env.NEXT_PUBLIC_OFFER_CONTRACT_ADDRESS,
                        OFFER_ALLOWANCE_WEI.toFormat({ groupSeparator: "" })
                    )
                );
            }

            if (editionId) {
                clauses.push(
                    offerContract.current.makeBuyOfferToToken.asClause(
                        smartContractAddress,
                        editionId,
                        amountWei,
                        OFFER_DURATION,
                        currencyContractAddress
                    )
                );
            } else if (tokenId) {
                clauses.push(
                    offerContract.current.makeBuyOfferToGlobal.asClause(
                        smartContractAddress,
                        tokenId,
                        amountWei,
                        OFFER_DURATION,
                        currencyContractAddress
                    )
                );
            } else {
                clauses.push(
                    offerContract.current.makeBuyOfferToExternalCollection.asClause(
                        smartContractAddress,
                        amountWei,
                        OFFER_DURATION,
                        currencyContractAddress
                    )
                );
            }
        }

        const transaction = await feeDelegation(clauses).call({
            comment:
                data.length > 1
                    ? `Placing ${data.length} offers.`
                    : data[0].previousOfferId
                    ? "Updating an offer."
                    : "Placing an offer.",
        });

        return { ...transaction, clauseCount: clauses.length };
    };

    const getOfferPaymentFee = async (paymentContractAddress: string) => {
        if (!offerContract.current) {
            return;
        }

        const { data } = await offerContract.current.feePercentMapping.call(
            paymentContractAddress
        );

        // returned value is in units per 1000
        return parseInt(data, 16) / 10;
    };

    const getOfferCollectionFee = async (nftContractAddress: string) => {
        if (!offerContract.current) {
            return;
        }

        const { data } = await offerContract.current.royaltyPercentVIP181.call(
            nftContractAddress
        );

        // returned value is in units per 1000
        return parseInt(data, 16) / 10;
    };

    const getBalance = async (address: string) => {
        let balances = [
            connex.current!.thor.account(address).get(),
            wrappedVETContract.current!.balanceOf.call(address),
            wovContract.current!.balanceOf.call(address),
        ];
        if (process.env.NEXT_PUBLIC_NETWORK !== "test") {
            balances = [
                ...balances,
                veusdContract.current!.balanceOf.call(address),
                shaContract.current!.balanceOf.call(address),
                vseaContract.current!.balanceOf.call(address),
            ];
        }
        const response = await Promise.all(balances);

        const result = {
            VET: new BigNumber(response[0].balance),
            vVET: new BigNumber(response[1].data),
            WoV: new BigNumber(response[2].data),
            VTHO: new BigNumber(response[0].energy),
            VEUSD: new BigNumber(0),
            SHA: new BigNumber(0),
            VSEA: new BigNumber(0),
        };

        if (process.env.NEXT_PUBLIC_NETWORK !== "test") {
            result.VEUSD = new BigNumber(response[3].data);
            result.SHA = new BigNumber(response[4].data);
            result.VSEA = new BigNumber(response[5].data);
        }

        return result;
    };

    const exchangeVETForVVET = async (amount: BigNumber) => {
        if (!wrappedVETContract.current) return;

        const clause = wrappedVETContract.current.deposit
            .value(amount.toFormat({ groupSeparator: "" }))
            .asClause();

        const amountVET = amount
            .dividedBy(10 ** 18)
            .toFormat({ groupSeparator: "", decimalSeparator: "." });

        return feeDelegation(clause).call({
            comment: `Exchanging ${amountVET} VET for ${amountVET} vVET.`,
        });
    };

    const exchangeVVETForVET = async (amountWEI: BigNumber) => {
        if (!wrappedVETContract.current) return;

        const clause = wrappedVETContract.current.withdraw.asClause(
            amountWEI.toFormat({ groupSeparator: "" })
        );

        const amountVET = amountWEI
            .dividedBy(10 ** 18)
            .toFormat({ groupSeparator: "", decimalSeparator: "." });

        return feeDelegation(clause).call({
            comment: `Exchanging ${amountVET} vVET for ${amountVET} VET.`,
        });
    };

    //#endregion

    //#region Transfer v2 token methods
    const transfer_v2 = async (tokens: TransferNFTParams[]): Promise<any> => {
        let clauses: any[] = [];

        for (const token of tokens) {
            const contract = await registerContract(
                token.smartContractAddress,
                ContractId.StandardNFT
            );

            if (contract) {
                clauses.push(
                    contract.safeTransferFrom.asClause(
                        token.from,
                        token.to,
                        token.tokenId
                    )
                );
            }

            clauses = [...clauses];
        }

        const tx = await feeDelegation(clauses).call({
            comment: `Transfer tokens`,
        });

        return { ...tx, clauseCount: clauses.length };
    };
    //#endregion

    //#region Staking
    const stake = async (...params: StakeParams[]) => {
        const clauses: any[] = [];

        for (const {
            tokenId,
            stakingContractAddress,
            ...saleParams
        } of params) {
            if (saleParams.auctionId || saleParams.saleId) {
                // Cancel all previous listings.
                clauses.push(
                    await createCancelSaleClause({ tokenId, ...saleParams })
                );
            }

            const stakingContract = await registerContract(
                stakingContractAddress,
                ContractId.PFPStaking
            );

            const { decoded } = await stakingContract!.pfpCollection.call();

            const tokenContract = await registerContract(
                decoded[0],
                ContractId.StandardNFT
            );

            // Multiple edition tokens are not supported for staking so we can
            // get the edition id from the token id.
            const editionId = isSameAddress(
                decoded[0],
                process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS!
            )
                ? tokenId.replace(/0$/, "1")
                : tokenId;

            // The approval clause needs to be always present since calls to
            // `getApproved` don't take into consideration which contract the
            // token was approved for.
            clauses.push(
                tokenContract!.approve.asClause(
                    stakingContractAddress,
                    editionId
                )
            );

            clauses.push(stakingContract!.stake.asClause(tokenId));
        }

        const tx = await feeDelegation(clauses).call({
            comment:
                params.length > 1
                    ? `Stake ${params.length} tokens.`
                    : "Stake a token.",
        });

        return { ...tx, clauseCount: clauses.length };
    };

    const unstake = async (...params: UnstakeParams[]) => {
        const clauses: any[] = [];

        for (const { tokenId, stakingContractAddress } of params) {
            const stakingContract = await registerContract(
                stakingContractAddress,
                ContractId.PFPStaking
            );

            clauses.push(stakingContract!.exit.asClause(tokenId));
        }

        const tx = await feeDelegation(clauses).call({
            comment:
                params.length > 1
                    ? `Unstake ${params.length} tokens.`
                    : "Unstake a token.",
        });

        return { ...tx, clauseCount: clauses.length };
    };

    const claim = async (...params: UnstakeParams[]) => {
        const clauses: any[] = [];

        for (const { tokenId, stakingContractAddress } of params) {
            const stakingContract = await registerContract(
                stakingContractAddress,
                ContractId.PFPStaking
            );

            clauses.push(stakingContract!.getReward.asClause(tokenId));
        }

        const tx = await feeDelegation(clauses).call({
            comment: "Claim rewards.",
        });

        return { ...tx, clauseCount: clauses.length };
    };

    const getStakingInfo = async (stakingContractAddress: string) => {
        const stakingContract = await registerContract(
            stakingContractAddress,
            ContractId.PFPStaking
        );
        const clauses = [
            stakingContract!.minimalStakingDuration.asClause(),
            stakingContract!.periodFinish.asClause(),
            stakingContract!.lastUpdateTime.asClause(),
            stakingContract!.rewardsDuration.asClause(),
            stakingContract!.rewardRate.asClause(),
            stakingContract!.rewardPerToken.asClause(),
            stakingContract!.virtualPriceMultiplier.asClause(),
            stakingContract!.totalSupply.asClause(),
        ];

        const results = await connex.current!.thor.explain(clauses).execute();
        const error = results.map((res) => res.vmError).find((err) => err);

        if (error) {
            throw new Error(error);
        }

        const minimumDuration = parseInt(results[0].data); // seconds
        // periodFinish === 0           -> not started
        // 0 < periodFinish === < now() -> finished
        // periodFinish > now()         -> ongoing
        const periodFinish = parseInt(results[1].data); // seconds
        // instant in time where the last interaction (stake, getReward, exit)
        // with the contract happened
        const lastUpdateTime = parseInt(results[2].data); // seconds
        // staking duration
        const rewardsDuration = parseInt(results[3].data); // seconds
        const rewardRate = new BigNumber(results[4].data); // wei / second
        const rewardPerToken = new BigNumber(results[5].data); // wei / token
        const virtualPriceMultiplier = new BigNumber(results[6].data); // wei
        // this is most likely [number of staked nfts in total] * virtualPriceMultiplier
        const totalSupply = new BigNumber(results[7].data); // wei
        const timeRemaining = periodFinish - Date.now() / 1000; // seconds
        const rewardRemaining = rewardRate.times(timeRemaining); // wei

        const periodRemaining = periodFinish - lastUpdateTime; // seconds
        const periodReward = rewardRate.times(periodRemaining); // wei

        const interestRate = // 1 / years ?
            totalSupply.gt(0) && periodRemaining > 0
                ? periodReward
                      .div(1e18)
                      .div(totalSupply)
                      .div(periodRemaining / (60 * 60 * 24 * 365))
                : null;

        const apy = interestRate // %
            ?.div(365)
            ?.plus(1)
            ?.pow(365)
            ?.minus(1)
            ?.times(100)
            ?.toNumber();

        const stakedCount = totalSupply.idiv(virtualPriceMultiplier).toNumber();

        return {
            periodFinish,
            lastUpdateTime,
            rewardsDuration,
            rewardRate,
            rewardPerToken,
            totalSupply,
            stakedCount,
            minimumDuration,
            rewardRemaining,
            apy: apy || 0,
        };
    };

    const getCollectionStakedPercentage = async (
        stakingContractAddress: string,
        collectionContractAddress: string
    ) => {
        const collectionContract = await registerContract(
            collectionContractAddress,
            ContractId.StandardNFT
        );
        const clauses = [
            collectionContract!.totalSupply.asClause(),
            collectionContract!.balanceOf.asClause(stakingContractAddress),
        ];

        const results = await connex.current!.thor.explain(clauses).execute();
        const error = results.map((res) => res.vmError).find((err) => err);

        if (error) {
            throw new Error(error);
        }

        const totalSupply = parseInt(new BigNumber(results[0].data).toFixed());
        const stakedCount = parseInt(new BigNumber(results[1].data).toFixed());

        return (stakedCount / totalSupply) * 100;
    };

    const getUserStakingInfo = async (
        stakingContractAddress: string,
        userAddress: string
    ) => {
        const stakingContract = await registerContract(
            stakingContractAddress,
            ContractId.PFPStaking
        );

        const clauses = [
            stakingContract!.earned.asClause(userAddress),
            stakingContract!.balanceNftStaked.asClause(userAddress),
        ];

        const results = await connex.current!.thor.explain(clauses).execute();

        // The call to `earned` is allowed to result in an error when the user
        // doesn't have tokens on stake.
        const error = results
            .slice(1)
            .map((res) => res.vmError)
            .find((err) => err);

        if (error) {
            throw new Error(error);
        }

        const earned = new BigNumber(results[0].data || 0); // wei
        const stakedCount = parseInt(results[1].data);

        return { stakedCount, earned };
    };

    const getTokenStakingInfo = async (
        stakingContractAddress: string,
        tokenId: string
    ) => {
        const stakingContract = await registerContract(
            stakingContractAddress,
            ContractId.PFPStaking
        );

        const earnedPerToken = await stakingContract!.earnedPerToken
            .call(tokenId)
            .then((r: any) => r.decoded[0]);

        const details = await stakingContract!.tokenDetail
            .call(tokenId)
            .then((r: any) => r.decoded);

        return {
            earnedPerToken: new BigNumber(earnedPerToken),
            virtualStaked: new BigNumber(details.virtualStaked),
            startTime: parseInt(details.startTime),
            endTime: parseInt(details.endTime),
            isExit: details.isExit,
            ticketOwner: details.ticketOwner,
        };
    };
    //#endregion

    //#region Burn mint info
    const getBurnMintWithCooldownInfo = async (
        smartContractAddress: string
    ) => {
        const contract = await registerContract(
            smartContractAddress,
            ContractId.BurnMintingPFP
        );

        const clauses = [
            contract!.totalSupply.asClause(),
            contract!.getTokenOnSale.asClause(),
            contract!.minimalCooldownDuration.asClause(),
        ];

        const results = await connex.current!.thor.explain(clauses).execute();

        const error = results[0].vmError || results[1].vmError;
        if (error) throw new Error(error);

        const mintedCount = parseInt(results[0].data);
        const nonMintedCount = parseInt(results[1].data);
        const cooldownDuration = results[2].reverted
            ? null
            : parseInt(results[2].data);
        const totalCount = mintedCount + nonMintedCount;

        return { totalCount, mintedCount, nonMintedCount, cooldownDuration };
    };

    const getBurnMintInfo = async (burnContractAddress: string) => {
        // const abi = [
        //     {
        //         inputs: [],
        //         name: "MAX_SUPPLY",
        //         outputs: [
        //             {
        //                 internalType: "uint256",
        //                 name: "",
        //                 type: "uint256",
        //             },
        //         ],
        //         stateMutability: "view",
        //         type: "function",
        //     },
        //     {
        //         inputs: [],
        //         name: "totalSupply",
        //         outputs: [
        //             {
        //                 internalType: "uint256",
        //                 name: "",
        //                 type: "uint256",
        //             },
        //         ],
        //         stateMutability: "view",
        //         type: "function",
        //     },
        // ];

        const abi = [
            {
                inputs: [],
                name: "getTokenOnSale",
                outputs: [
                    {
                        internalType: "uint256",
                        name: "",
                        type: "uint256",
                    },
                ],
                stateMutability: "view",
                type: "function",
            },
        ];

        const clauses = [
            connex
                .current!.thor.account(burnContractAddress)
                .method(abi[0])
                .asClause(),
            // connex
            //     .current!.thor.account(burnContractAddress)
            //     .method(abi[1])
            //     .asClause(),
        ];

        const results = await connex.current!.thor.explain(clauses).execute();

        const error = results.map((res) => res.vmError).find((err) => err);
        if (error) throw new Error(error);

        // const totalCount = parseInt(results[0].data);
        const totalCount = 965;
        const nonMintedCount = parseInt(results[0].data);

        return { totalCount, mintedCount: totalCount - nonMintedCount };
    };
    //#endregion

    //#region Swap on Buy
    const isWhitelistedForBurn = async (
        smartContractAddress: string,
        userAddress: string
    ): Promise<boolean> => {
        const abi = [
            {
                inputs: [
                    { internalType: "address", name: "", type: "address" },
                ],
                name: "whiteList",
                outputs: [{ internalType: "bool", name: "", type: "bool" }],
                stateMutability: "view",
                type: "function",
            },
        ];

        const pfpContract = new web3.current.eth.Contract(
            abi,
            smartContractAddress
        );

        return pfpContract.methods.whiteList(userAddress).call();
    };

    const getUserTokenCount = async (
        smartContractAddress: string,
        userAddress: string
    ): Promise<number> => {
        const pfpContract = await registerContract(
            smartContractAddress,
            ContractId.StandardNFT
        );

        const { data } = await pfpContract!.balanceOf.call(userAddress);
        return parseInt(data);
    };

    const methods = {
        transfer,
        mintToken,
        burnMintWithCooldown,
        mintWithCooldown,
        burnMint,
        burnMintAndPay,
        burn,
        checkTransaction,
        checkTransactionOnBlockchain,
        checkTransactionByBackend,
        createBidAuction,
        bid,
        settleAuction,
        cancelAuction,
        getOfferPaymentFee,
        getOfferCollectionFee,
        getBalance,
        exchangeVETForVVET,
        exchangeVVETForVET,
        createOffer,
        cancelOffer,
        acceptOffer,
        transfer_v2,
        stake,
        unstake,
        getStakingInfo,
        getCollectionStakedPercentage,
        getTokenStakingInfo,
        getUserStakingInfo,
        claim,
        getBurnMintWithCooldownInfo,
        getBurnMintInfo,
        isWhitelistedForBurn,
        getUserTokenCount,
    };

    // Each method is wrapped with a function that waits for `initialized` to
    // be resolved before continuing execution.
    const proxy = new Proxy(methods, {
        get(target, property) {
            return async (...args: any[]) => {
                await initialized;
                const handler = target[property as keyof typeof target];
                return (handler as any).apply(null, args);
            };
        },
    });

    return (
        <ConnexContext.Provider
            value={{
                connex: connex.current,
                ...proxy,
                v2: {
                    transfer: proxy.transfer_v2,
                },
            }}
        >
            {children}
        </ConnexContext.Provider>
    );
};

/**
 * @deprecated Use `useBlockchain` (/src/blockchain) when possible.
 */
export const useConnex = () => React.useContext(ConnexContext);

export default dynamic(() => Promise.resolve(ConnexProvider));
