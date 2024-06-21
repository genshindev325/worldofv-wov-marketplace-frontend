import usePriceConversion from "@/hooks/usePriceConversion";
import BigNumber from "bignumber.js";
import { FC, useEffect, useMemo, useState } from "react";
import { KeyedMutator } from "swr";
import { useBalance } from "../components/BalanceProvider";
import { Button } from "../components/common/Button";
import { Divider } from "../components/common/Divider";
import { Flex } from "../components/common/Flex";
import { Text } from "../components/common/Text";
import { useConnex } from "../components/ConnexProvider";
import { GetOffersForUserQueryResult } from "../generated/graphql";
import { Currency } from "../types/Currencies";
import { IOfferData, OfferEdition } from "../types/OfferData";
import formatPrice from "../utils/formatPrice";
import AnimatedModal from "./AnimatedModal";

const STANDARD_FEE = 3;
const MVA_FEE = 1.5;

export interface ModalAcceptOfferProps {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    refreshOffers:
        | KeyedMutator<GetOffersForUserQueryResult>
        | (() => Promise<void>);
    offer?: IOfferData | null;
    edition?: OfferEdition | null;
}

export default function ModalAcceptOffer({
    isOpen,
    ...props
}: ModalAcceptOfferProps) {
    const info = useMemo(() => {
        const editionId = props.edition?.editionId
            ?.slice(-5)
            ?.replace(/^0+/, "");
        const name = props.offer?.collection?.name || props.offer?.token?.name;
        return name?.concat(" #" + editionId);
    }, [
        props.edition?.editionId,
        props.offer?.collection?.name,
        props.offer?.token?.name,
    ]);

    return (
        <AnimatedModal
            small
            title="Accept Offer"
            info={<Text color="accent">{info}</Text>}
            isOpen={isOpen}
            setIsOpen={props.setOpen}
            transitionProps={{ mountOnEnter: false }}
        >
            {props.offer && props.edition && (
                <AcceptOfferContent {...(props as AcceptOfferContentProps)} />
            )}
        </AnimatedModal>
    );
}

type AcceptOfferContentProps = Pick<
    ModalAcceptOfferProps,
    "setOpen" | "refreshOffers"
> & {
    offer: IOfferData;
    edition: OfferEdition;
};

function AcceptOfferContent({
    offer,
    edition,
    setOpen,
    refreshOffers,
}: AcceptOfferContentProps) {
    const {
        acceptOffer,
        checkTransaction,
        getOfferPaymentFee,
        getOfferCollectionFee,
    } = useConnex();

    const { refreshBalance } = useBalance();
    const priceConversion = usePriceConversion();

    const [paymentFeePercent, setPaymentFee] = useState<number | null>(null);
    const [collectionFeePercent, setCollectionFee] = useState<number | null>(
        null
    );

    const [isLoading, setLoading] = useState(true);
    const [acceptError, setAcceptError] = useState<any>(null);
    const [fetchFeeError, setFetchFeeError] = useState<any>(null);

    const offerValue = useMemo(() => new BigNumber(offer.price), [offer.price]);

    const paymentFee = useMemo(
        () =>
            paymentFeePercent === null
                ? null
                : offerValue.multipliedBy(paymentFeePercent!),
        [offerValue, paymentFeePercent]
    );

    const creatorFee = useMemo(() => {
        if (collectionFeePercent === null || paymentFee === null) return null;

        const feePercent = offer.collection
            ? collectionFeePercent
            : edition.royalty / 100;

        return offerValue.minus(paymentFee).multipliedBy(feePercent);
    }, [collectionFeePercent, edition, offer, offerValue, paymentFee]);

    const royaltyValue = useMemo(
        () => (offer.collection ? collectionFeePercent : edition.royalty / 100),
        [collectionFeePercent, edition.royalty, offer.collection]
    );

    const total = useMemo(
        () =>
            creatorFee === null || paymentFee === null
                ? null
                : offerValue.minus(creatorFee!).minus(paymentFee!),
        [offerValue, creatorFee, paymentFee]
    );

    const totalUSD = useMemo(
        () =>
            total === null || !priceConversion
                ? null
                : total.dividedBy(1e18).toNumber() *
                  priceConversion[
                      offer.currency === "vVET" ? "VET" : offer.currency
                  ],
        [priceConversion, total, offer.currency]
    );

    const getFees = async () => {
        try {
            const paymentFeePercent = await getOfferPaymentFee(
                offer!.addressVIP180
            );

            const collectionFeePercent = await getOfferCollectionFee(
                offer!.smartContractAddress
            );

            setPaymentFee(paymentFeePercent! / 1000);
            setCollectionFee(collectionFeePercent! / 1000);
        } catch (error: any) {
            console.warn(error.message || error);
            setFetchFeeError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(
        () => {
            getFees();
        },
        [offer] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const onAccept = async () => {
        try {
            setLoading(true);
            setAcceptError(null);

            const tx = await acceptOffer({
                smartContractAddress: offer.smartContractAddress,
                tokenId: offer.tokenId,
                editionId: offer.editionId,
                offerId: offer.offerId,
                useEditionId: edition.editionId,
                saleId: edition.saleId ?? undefined,
                auctionId: edition.auctionId ?? undefined,
            });

            await checkTransaction({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: "OfferAccepted",
                toast: { enabled: true, success: "Offer accepted!" },
            });

            await refreshBalance();
            await refreshOffers();

            setOpen(false);
        } catch (error: any) {
            console.warn(error.message || error);
            setAcceptError(error);
        } finally {
            setLoading(false);
        }
    };

    const isMVACollection =
        offer?.collection?.name != null &&
        (offer.collection.name.startsWith("Mad Ⓥ-Apes") ||
            offer.collection.name.startsWith("VeKongs"));

    return (
        <Flex flexDirection="column" columnGap={3}>
            <ReceiptEntry
                name="Offer Value"
                valueWei={new BigNumber(offer.price)}
                currency={offer.currency}
            />
            <Divider />
            {paymentFeePercent != null && (
                <Entry label="Marketplace Fee">
                    {isMVACollection ? (
                        offer.currency === "WoV" ? (
                            0
                        ) : (
                            MVA_FEE
                        )
                    ) : paymentFeePercent > 0 ? (
                        paymentFeePercent * 100
                    ) : offer.currency === "WoV" ? (
                        <Text as="span">
                            <Text color="accent" as="span">
                                <s>{STANDARD_FEE}</s>
                            </Text>{" "}
                            0
                        </Text>
                    ) : (
                        STANDARD_FEE
                    )}
                    %
                </Entry>
            )}
            {paymentFeePercent != null &&
                isMVACollection &&
                offer.currency !== "WoV" && (
                    <Entry
                        label={
                            offer!.collection!.name.startsWith("Mad Ⓥ-Apes")
                                ? "Mad Ⓥ-Apes DAO"
                                : "VeKongs DAO"
                        }
                    >
                        {MVA_FEE}%
                    </Entry>
                )}
            {royaltyValue != null && (
                <Entry label="Royalty">{royaltyValue * 100}%</Entry>
            )}
            {(paymentFeePercent != null || royaltyValue) && <Divider />}
            <ReceiptEntry
                name="Total"
                valueWei={total}
                valueUSD={totalUSD}
                currency={offer.currency}
            />
            <Button
                disabled={fetchFeeError}
                loader={isLoading}
                onClick={onAccept}
            >
                {fetchFeeError
                    ? "Could not fetch fees"
                    : acceptError
                    ? "Retry"
                    : "Accept"}
            </Button>
        </Flex>
    );
}

interface EntryProps {
    label: string;
}

const Entry: FC<EntryProps> = ({ children, label }) => (
    <Flex justifyContent="space-between">
        <Text variant="body2" color="accent">
            {label}
        </Text>
        <Text variant="body2" textAlign="right">
            {children}
        </Text>
    </Flex>
);

interface ReceiptEntryProps {
    name: string;
    valueWei?: BigNumber | null;
    valueUSD?: number | null;
    currency: Currency;
}

function ReceiptEntry({
    name,
    valueWei,
    valueUSD,
    currency,
}: ReceiptEntryProps) {
    const formattedPrice = useMemo(
        () => (valueWei ? formatPrice(valueWei) : "--") + ` ${currency}`,
        [valueWei, currency]
    );

    const formattedPriceUSD = useMemo(
        () => (valueUSD ? formatPrice(valueUSD, false) + " USD" : null),
        [valueUSD]
    );

    return (
        <Entry label={name}>
            <span>{formattedPrice}</span>
            <br />
            {formattedPriceUSD && (
                <Text color="accent">
                    <small>≈ {formattedPriceUSD}</small>
                </Text>
            )}
        </Entry>
    );
}
