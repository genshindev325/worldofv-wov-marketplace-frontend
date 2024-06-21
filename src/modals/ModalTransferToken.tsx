import { Box } from "@/components/common/Box";
import SearchResultModal from "@/components/Header/GlobalSerachBar/SearchResultModal";
import useGraphQL from "@/hooks/useGraphQL";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import useSWR from "swr";
import Web3 from "web3";
import * as yup from "yup";
import { Alert } from "../components/common/Alert";
import { Button } from "../components/common/Button";
import { Input } from "../components/FormInputs/Input";
import { useItem } from "../components/ProductDetail/ProductDetailProvider";
import AnimatedModal from "./AnimatedModal";

interface ModalTransferTokenProps {
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void;
    onTransfer: SubmitHandler<any>;
}

const validationSchema = yup.object().shape({
    to: yup
        .string()
        .required()
        .test(
            "isValidAddress",
            "Given address is not a valid VeChain address.",
            (value) => (value ? Web3.utils.isAddress(value) : false)
        ),
});

const ModalTransferToken: React.FC<ModalTransferTokenProps> = ({
    isOpen,
    setIsOpen,
    onTransfer,
}) => {
    const { token, selectedEdition } = useItem();
    const { sdk } = useGraphQL();

    const [isFocus, setIsFocus] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);

    const {
        handleSubmit,
        register,
        watch,
        reset,
        setValue,
        formState: { isValid, isSubmitting },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        //review this
        const subscription = watch((value) =>
            setShouldFetch(value.to?.trim().length > 2 && isFocus && !isValid)
        );
        setShouldFetch(watch().to?.trim().length > 2 && isFocus && !isValid);
        return () => subscription.unsubscribe();
    }, [isFocus, isValid, watch]);

    const { data, isValidating } = useSWR(
        shouldFetch ? [watch().to?.trim(), "SEARCH_USERS_BY_STRING"] : null,
        (text) => sdk.SearchUsersByString({ text, limit: 12 })
    );

    const setValues = (address: string) =>
        setValue("to", address ?? "", {
            shouldValidate: true,
        });
    return (
        <AnimatedModal
            small
            title="Transfer token"
            info={
                <>
                    <strong>{token.name}</strong> edition{" "}
                    <strong>#{selectedEdition?.editionNumber}</strong> will be
                    transferred
                </>
            }
            {...{ isOpen, setIsOpen }}
        >
            <form onSubmit={handleSubmit(onTransfer)}>
                <Box position="relative" width="100%">
                    <Input
                        inputProps={{
                            name: "to",
                            placeholder:
                                "Search profile or enter a VeChain address",
                        }}
                        register={register}
                        setIsFocus={setIsFocus}
                        buttonIcon={shouldFetch ? "close" : undefined}
                        onButtonClick={reset}
                        borderRadius={5}
                    />
                    {(data || isValidating) && (
                        <SearchResultModal
                            isOpen={shouldFetch}
                            isLoading={isValidating}
                            searchResult={
                                data?.searchByString ?? {
                                    collections: null,
                                    tokens: null,
                                    users: null,
                                }
                            }
                            searchText={watch().to?.trim()}
                            setValue={setValues}
                            setIsSearchBarOpen={() => null}
                        />
                    )}
                    <Alert
                        title="Action cannot be undone"
                        text="Please ensure that the recipient addresses are VeChain only"
                        style={{ marginTop: 32 }}
                    />

                    <Buttons>
                        <Button
                            type="submit"
                            loader={isSubmitting}
                            disabled={!isValid || isSubmitting}
                        >
                            Transfer
                        </Button>
                    </Buttons>
                </Box>
            </form>
        </AnimatedModal>
    );
};

const Buttons = styled.div`
    margin-top: 32px;

    ${Button} {
        width: 100%;
    }
`;

export default ModalTransferToken;
