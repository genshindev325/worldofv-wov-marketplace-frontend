import useGraphQL from "@/hooks/useGraphQL";
import { userAddressSelector } from "@/store/selectors";
import BigNumber from "bignumber.js";
import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import useSWR from "swr";
import { Popup } from "../../components/common/Popup";
import FlatLoader from "../../components/FlatLoader";
import { Input } from "../../components/FormInputs/Input";
import Head from "../../components/Head";
import Icon from "../../components/Icon";
import Link from "../../components/Link";
import { QueryGetMinimumOffersForUser } from "../../graphql/get-minimum-offers-for-user.graphql";
import { MutationUpsertMinimumOffer } from "../../graphql/upsert-minimum-offer.graphql";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import IMinimumOfferData from "../../types/MinimumOfferData";

const { dark, media } = mixins;
const { colors, typography, breakpoints } = variables;
const { neutrals } = colors;

const UPDATE_DELAY_MS = 400;

export default function OfferSettings() {
    const userAddress = useRecoilValue(userAddressSelector);
    const { client } = useGraphQL();

    const {
        data: offers,
        mutate,
        error,
    } = useSWR(
        [QueryGetMinimumOffersForUser, { userAddress }],
        async (q: string, vs: any) =>
            client
                .request(q, vs)
                .then((res) => res.offers as IMinimumOfferData[]),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        }
    );

    return (
        <Container>
            <Head title="Minimum Offers" />
            <Header>Minimum Offers</Header>
            <Info>
                Set a minimum offer for collections to ignore low offers.{" "}
                <ExtraInfoTooltip />
            </Info>
            <Divider />
            {error ? (
                <FallbackInfo title="An error occured." />
            ) : !offers ? (
                <FlatLoader size={64} />
            ) : !offers!.length ? (
                <FallbackInfo
                    title={
                        <>
                            <span>No </span>
                            <Link href="/collections" passHref>
                                <HighlightedLink>collections</HighlightedLink>
                            </Link>
                            <span> to manage offers</span>
                        </>
                    }
                    info={
                        "You currently don't have any collections and items " +
                        "to manage offers."
                    }
                />
            ) : (
                <Grid>
                    {offers!.map((o) => (
                        <Item
                            key={o.collection.smartContractAddress}
                            data={o}
                            refreshOffers={async () => {
                                await mutate();
                            }}
                        />
                    ))}
                </Grid>
            )}
        </Container>
    );
}

interface ItemProps {
    data: IMinimumOfferData;
    refreshOffers: () => Promise<void>;
}

function Item({ data, refreshOffers }: ItemProps) {
    const { price, collection, editionCount } = data;
    const { client } = useGraphQL();

    const defaultValue = useMemo(
        () =>
            price && price !== "0"
                ? new BigNumber(price)
                      .div(1e18)
                      .toFormat({ groupSeparator: "", decimalSeparator: "." })
                : "",
        [price]
    );

    const [value, setValue] = useState<string>(defaultValue);
    const [isModified, setIsModified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const href = useMemo(
        () =>
            `/collection/${
                data.collection?.customUrl || data.collection.collectionId
            }`,
        [data.collection.collectionId, data.collection?.customUrl]
    );

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        if (input && !input.match(/^\s*\d+[.|,]?\d*$/)?.length) return;
        setIsModified(true);
        setValue(input || "");
    };

    const onSubmit = async () => {
        try {
            setHasError(false);
            setIsLoading(true);

            const price = value
                ? new BigNumber(value.replace(",", "."))
                      .multipliedBy(1e18)
                      .toFormat({ groupSeparator: "" })
                : "0";

            await client.request(MutationUpsertMinimumOffer, {
                smartContractAddress: collection.smartContractAddress,
                price,
            });

            await refreshOffers();
        } catch (error) {
            console.warn(error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(
        () => {
            if (!isModified) return;
            const timeout = setTimeout(onSubmit, UPDATE_DELAY_MS);
            return () => clearTimeout(timeout);
        },
        [value] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const icon = hasError ? (
        <FaExclamationTriangle size={24} color={colors.red} />
    ) : isLoading ? (
        <FlatLoader size={24} />
    ) : (
        <FaCheck size={24} color={colors.green} />
    );

    return (
        <ItemContainer>
            <Link href={href}>
                <a>
                    <ItemThumbnail src={collection.thumbnailImageUrl} />
                </a>
            </Link>
            <ItemData>
                <Link href={href} passHref>
                    <ItemTitle>{collection.name}</ItemTitle>
                </Link>

                <ItemCount>
                    <strong>{editionCount}</strong> Collected
                </ItemCount>

                <Input
                    rightDecoration={
                        <InputLabel>
                            vVET
                            {icon}
                        </InputLabel>
                    }
                    inputProps={{
                        placeholder: "Minimum Offer",
                        inputMode: "decimal",
                        onChange,
                        value,
                    }}
                />
            </ItemData>
        </ItemContainer>
    );
}

function ExtraInfoTooltip() {
    return (
        <Popup
            content={
                <ExtraInfoContent>
                    You will not be notified on offers below your minimum
                    amounts.
                </ExtraInfoContent>
            }
            trigger="mouseenter click"
        >
            <Icon icon="info-circle" color={colors.blue} />
        </Popup>
    );
}

interface FallbackInfoProps {
    title?: ReactNode;
    info?: ReactNode;
}

function FallbackInfo({ title, info }: FallbackInfoProps) {
    return (
        <FallbackContainer>
            {title && <FallbackTitle>{title}</FallbackTitle>}
            {info && <Info>{info}</Info>}
        </FallbackContainer>
    );
}

const HighlightedLink = styled.a`
    color: ${colors.blue};

    :hover {
        opacity: 0.9;
    }
`;

const Container = styled.div`
    padding-block: 32px;
    padding-inline: 16px;
    margin-inline: auto;
    max-width: ${breakpoints.x};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    width: 100%;
    flex-grow: 1;
`;

const Header = styled.h1`
    ${typography.h2}
`;

const Info = styled.p`
    ${typography.body2}
    color: ${neutrals[4]};
`;

const FallbackContainer = styled.p`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 16px;
    flex-grow: 1;
`;

const FallbackTitle = styled.p`
    ${typography.body1}
`;

const ExtraInfoContent = styled.p`
    ${typography.caption1}
    padding: 8px;
`;

const Grid = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
`;

const InputLabel = styled.div`
    ${typography.caption1}
    color: ${neutrals[4]};
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 4px;
`;

const ItemContainer = styled.div`
    border: 1px solid ${neutrals[6]};
    border-radius: 8px;
    max-width: 384px;
    display: flex;
    padding: 8px;
    gap: 8px;

    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

const ItemData = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const ItemTitle = styled.a`
    ${typography.body2}
`;

const ItemCount = styled.p`
    ${typography.caption1}
    color: ${neutrals[4]};

    strong {
        ${typography.bodyBold2}
        font-weight: 600;
    }
`;

const ItemThumbnail = styled.img`
    object-fit: cover;
    width: 128px;
    height: 128px;
    border-radius: 8px;
    background-color: ${neutrals[6]};

    ${media.s`
        width: 112px;
        height: 112px;
    `}

    ${dark`
        background-color: ${neutrals[3]};
    `}
`;

const Divider = styled.div`
    border-bottom: 1px solid ${neutrals[5]};
    width: 100%;

    ${dark`
        border-color: ${neutrals[3]}
    `}
`;
