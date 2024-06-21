import { Input } from "@/components/FormInputs/Input";
import useGraphQL from "@/hooks/useGraphQL";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import useSWR from "swr";
import SearchResultModal from "../SearchResultModal";

interface GlobalSearchBarProps {
    setIsSearchBarOpen?: (value: boolean) => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
    setIsSearchBarOpen,
}) => {
    const [shouldFetch, setShouldFetch] = React.useState(false);
    const [isFocus, setIsFocus] = React.useState(false);
    const router = useRouter();
    const { sdk } = useGraphQL();

    const { register, watch, reset, setValue } = useForm();
    const setValues = (address: string) => setValue("search", address);

    useEffect(() => {
        const subscription = watch((value) =>
            setShouldFetch(value.search?.trim().length > 2 && isFocus)
        );
        setShouldFetch(watch().search?.trim().length > 2 && isFocus);
        return () => subscription.unsubscribe();
    }, [isFocus, watch]);
    useEffect(
        () => {
            router.events.on("routeChangeStart", () => setValues(""));

            return () => {
                router.events.off("routeChangeStart", () => setValues(""));
            };
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const { data, isValidating } = useSWR(
        shouldFetch ? [watch().search?.trim(), "SEARCH_BY_STRING"] : null,
        (text) => sdk.SearchByString({ text, limit: 4 })
    );

    return (
        <Container>
            <form>
                <Input
                    inputProps={{
                        name: "search",
                        placeholder: "Search Items, Artists, and Collections",
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
                        isGlobalSearch
                        searchResult={
                            data?.searchByString ?? {
                                collections: null,
                                tokens: null,
                                users: null,
                            }
                        }
                        searchText={watch().search?.trim()}
                        setValue={setValues}
                        setIsSearchBarOpen={setIsSearchBarOpen}
                    />
                )}
            </form>
        </Container>
    );
};

const Container = styled.div`
    position: relative;
    margin-left: 25px;
    flex-grow: 1;
    max-width: 550px;
    @media only screen and (max-width: ${(props) =>
            props.theme.breakpoints.m}) {
        margin: 10px 40px;
        z-index: -1;
    }
    .field-wrap {
        border-radius: 20px;
        height: 40px;
        min-height: 40px;
    }
`;
