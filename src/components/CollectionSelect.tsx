import useGraphQL from "@/hooks/useGraphQL";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { components, OptionProps, SingleValueProps } from "react-select";
import styled from "styled-components";
import useSWR from "swr";
import { VerifiedStatus } from "../generated/graphql";
import { useProfile } from "../providers/ProfileProvider";
import { ICollectionData } from "../types/CollectionData";
import { Select } from "./FormInputs/Select";
import UserAvatar from "./UserAvatar";

export interface CollectionSelectProps {
    selectedCollectionId?: string;
    onSelectCollection: (collection: ICollectionData | null) => void;
    showDeselectOption?: boolean;
    className?: string;
    needsStakingAddress?: boolean;
    removeGenesisCollections?: boolean;
}

const CollectionSelect: React.FC<CollectionSelectProps> = ({
    selectedCollectionId,
    onSelectCollection = () => {},
    showDeselectOption,
    className,
    needsStakingAddress,
    removeGenesisCollections,
}) => {
    const { user } = useProfile();
    const { sdk } = useGraphQL();

    const { data } = useSWR(
        [{ ownerAddress: user?.address }, "WOV_COLLECTIONS"],
        (args) => sdk.GetOwnedWoVCollections(args),
        { revalidateOnFocus: false }
    );

    const options = useMemo(() => {
        let collections = data?.collections;
        if (needsStakingAddress)
            collections = collections?.filter(
                (collection) =>
                    collection.name != null &&
                    [
                        "Mad Ⓥ-Apes  Alpha",
                        "Corgi Gang",
                        "Mad Ⓥ-Apes  Fusion",
                        "Mad Ⓥ-Apes Elementals",
                        "VeKongs 2.0",
                        "Psycho Beasts Prime",
                        "Psycho Beasts Nemesis",
                        "VVAR DOGS",
                        "Ukiyoe Warriors",
                        "Ukiyoe Yōkai",
                        "Mino Mob",
                        "BFFC Ladies",
                        "The New Standardship",
                        "Fear of Death",
                    ].includes(collection.name)
            );
        if (removeGenesisCollections)
            collections = collections?.filter(
                (collection) =>
                    collection.name !== "Genesis" &&
                    collection.name !== "Genesis Special"
            );
        return collections?.map((c) => ({
            label: c.name,
            value: c.collectionId,
            thumbnailImageUrl: c.thumbnailImageUrl,
            isVerified: c.isVerified,
            stakingContractAddresses: c.stakingContractAddresses,
        }));
    }, [data?.collections, needsStakingAddress, removeGenesisCollections]);

    const selectedCollection = useMemo(
        () => options?.find((o) => o.value === selectedCollectionId),
        [options, selectedCollectionId]
    );

    const input = useRef<Element | null>(null);

    // We keep track of the focus of the input because we want the selected
    // option to be hidden whenever the input is active.
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
        if (!input.current) {
            input.current = document.querySelector("#collection-select-input");
        }
    });

    useEffect(() => {
        if (!input.current) return;

        const onFocus = () => setIsInputFocused(true);
        const onBlur = () => setIsInputFocused(false);

        input.current.addEventListener("focus", onFocus);
        input.current.addEventListener("blur", onBlur);

        return () => {
            input.current!.removeEventListener("focus", onFocus);
            input.current!.removeEventListener("blur", onBlur);
        };
    }, [input.current?.id]);

    const onChange = (o: any) => {
        onSelectCollection?.(
            data!.collections!.find(
                (c) => c.collectionId === o?.value
            ) as ICollectionData
        );
    };

    return (
        <StyledSelect
            className={className}
            inputProps={{
                placeholder: data ? "Search a collection..." : "Loading...",
                isDisabled: !data,
                isLoading: !data,
                isClearable: showDeselectOption,
                options: options!,
                value: selectedCollection,
                onChange,
                components: { Option, SingleValue },
                controlShouldRenderValue: !isInputFocused,
                inputId: "collection-select-input",
                blurInputOnSelect: true,
            }}
        />
    );
};

function SingleValue({ children, ...props }: SingleValueProps<any>) {
    return (
        <components.SingleValue {...props}>
            <SingleValueContainer>
                <Avatar {...props.data} style={{ marginRight: 8 }} />
                <p>{children}</p>
            </SingleValueContainer>
        </components.SingleValue>
    );
}

function Option(props: OptionProps<any>) {
    return (
        <OptionContainer>
            <Avatar {...props.data} style={{ position: "absolute", left: 8 }} />
            <components.Option
                {...props}
                innerProps={{
                    style: {
                        padding: "10px 14px 10px 50px",
                    },
                    ...props.innerProps,
                }}
            />
        </OptionContainer>
    );
}

const SingleValueContainer = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 6px 8px;

    > p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const OptionContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const StyledSelect = styled(Select)`
    .react-select__single-value {
        margin-left: -8px;
    }

    .react-select__value-container {
        margin: 0 0 0 8px;
    }
`;

const Avatar = ({
    thumbnailImageUrl,
    isVerified,
    ...rest
}: {
    thumbnailImageUrl: string;
    isVerified: boolean;
}) => (
    <UserAvatar
        src={thumbnailImageUrl}
        verified={isVerified}
        verifiedLevel={
            isVerified ? VerifiedStatus.Verified : VerifiedStatus.NotVerified
        }
        size={32}
        verifiedSize={12}
        {...rest}
    />
);

export default dynamic(() => Promise.resolve(CollectionSelect), {
    ssr: false,
});
