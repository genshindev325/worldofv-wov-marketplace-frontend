import {
    NumberParam,
    StringParam,
    useQueryParams,
    withDefault,
} from "next-query-params";
import React, { useCallback, useMemo } from "react";
import { OptionItemProps } from "../components/FormInputs/Select";
import {
    CATEGORY_OPTIONS,
    CREATOR_OPTIONS,
    PaymentOption,
    PAYMENT_OPTIONS,
    SORT_OPTIONS,
    TOKEN_TYPE_FILTER_OPTIONS,
} from "../constants/marketplaceFilterOptions";
import { findOrFallback } from "../utils/findOrFallback";

// TODO: add types for OptionItems
interface MarketplaceContextProps {
    page: number;
    setPage: (value: number) => void;
    selectedSort: OptionItemProps;
    setSelectedSort: (value: OptionItemProps) => void;
    selectedPayment: OptionItemProps<PaymentOption>;
    setSelectedPayment: (value: OptionItemProps<PaymentOption>) => void;
    selectedCategory: OptionItemProps;
    setSelectedCategory: (value: OptionItemProps) => void;
    selectedCreator: OptionItemProps;
    setSelectedCreator: (value: OptionItemProps) => void;
    query: string;
    setQuery: (value: string | null | undefined) => void;
    selectedTokenType: OptionItemProps;
    setSelectedTokenType: (value: OptionItemProps) => void;
    resetToDefaults: () => void;
}

export const MarketplaceContext = React.createContext<MarketplaceContextProps>(
    {} as any
);

export const MarketplaceProvider: React.FC<React.PropsWithChildren<any>> = ({
    children,
}) => {
    const [state, setState] = useQueryParams({
        page: withDefault(NumberParam, 1),
        query: withDefault(StringParam, ""),
        sort: withDefault(StringParam, SORT_OPTIONS[0].value),
        payment: withDefault(StringParam, PAYMENT_OPTIONS[0].value),
        creator: withDefault(StringParam, CREATOR_OPTIONS[0].value),
        category: withDefault(StringParam, CATEGORY_OPTIONS[0].value),
        tokenType: withDefault(StringParam, TOKEN_TYPE_FILTER_OPTIONS[0].value),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const stateKeys = useMemo(() => Object.keys(state), []);

    const resetToDefaults = useCallback(() => {
        // Set all state keys to `undefined` to clear up the state
        setState(
            stateKeys.reduce((obj, key) => ({ ...obj, [key]: undefined }), {})
        );
    }, [stateKeys, setState]);

    const setStateField = useCallback(
        (field: keyof typeof state) => (value: any) => {
            setState((prev) => ({
                ...prev,
                page: 1,
                // ^ Reset page number when any of the filters change
                [field]: value,
            }));
        },
        [setState]
    );

    const setOptionField = useCallback(
        (field: keyof typeof state) => (opt: OptionItemProps) =>
            setStateField(field)(opt.value),
        [setStateField]
    );

    return (
        <MarketplaceContext.Provider
            value={{
                // Convert obj to string and viceversa
                selectedSort: findOrFallback(
                    SORT_OPTIONS,
                    (o) => o.value === state.sort
                ),
                setSelectedSort: setOptionField("sort"),
                selectedPayment: findOrFallback(
                    PAYMENT_OPTIONS,
                    (o) => o.value === state.payment
                ),
                setSelectedPayment: setOptionField("payment"),
                selectedCreator: findOrFallback(
                    CREATOR_OPTIONS,
                    (o) => o.value === state.creator
                ),
                setSelectedCreator: setOptionField("creator"),
                selectedCategory: findOrFallback(
                    CATEGORY_OPTIONS,
                    (o) => o.value === state.category
                ),
                setSelectedCategory: setOptionField("category"),
                selectedTokenType: findOrFallback(
                    TOKEN_TYPE_FILTER_OPTIONS,
                    (o) => o.value === state.tokenType
                ),
                setSelectedTokenType: setOptionField("tokenType"),
                // End convert obj to string
                query: state.query,
                setQuery: setStateField("query"),
                page: state.page,
                setPage: setStateField("page"),
                resetToDefaults,
            }}
        >
            {children}
        </MarketplaceContext.Provider>
    );
};

export const useMarketplace = () => React.useContext(MarketplaceContext);
