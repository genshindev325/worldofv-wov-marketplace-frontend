import { isEmpty } from "lodash";
import {
    NumberParam,
    StringParam,
    useQueryParams,
    withDefault,
} from "next-query-params";
import { useRouter } from "next/router";
import {
    createContext,
    FC,
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from "react";
import { OptionItemProps } from "../components/FormInputs/Select";
import { NavItemProps } from "../components/PillsNav";
import { TOKEN_TYPE_FILTER_OPTIONS } from "../constants/marketplaceFilterOptions";
import {
    PROFILE_TAB_ON_AUCTION_SORT_OPTIONS,
    PROFILE_TAB_SORT_OPTIONS,
} from "../constants/profileFilterOptions";
import { UserFragment } from "../generated/graphql";
import {
    ISelectedTokenAttributes,
    SelectedTokenAttributesParam,
} from "../types/TokenData";
import {
    IUserTokensCount,
    UserData,
    UserLandingTabEnum,
} from "../types/UserData";
import { findOrFallback } from "../utils/findOrFallback";
import { removeQueryParams } from "../utils/removeQueryParams";

// TODO: add types for OptionItems
interface ProfileContextProps {
    user: UserData;
    tabs: NavItemProps[];
    selectedTab: NavItemProps;
    setSelectedTab: (value: NavItemProps) => void;
    page: number;
    setPage: (value: number) => void;
    query: string;
    setQuery: (value: string) => void;
    sortOptions: OptionItemProps[];
    selectedSort: OptionItemProps;
    setSelectedSort: (value: OptionItemProps) => void;
    selectedTokenType: OptionItemProps;
    setSelectedTokenType: (value: OptionItemProps) => void;
    selectedCollectionId: string | undefined;
    setSelectedCollectionId: (value: string | undefined) => void;
    properties: ISelectedTokenAttributes | undefined;
    setProperties: (value: ISelectedTokenAttributes | undefined) => void;
}

export const ProfileContext = createContext<ProfileContextProps>({} as any);

// Whenever we switch in or out of any of the following tabs
// we need to rest the state.
const RESET_TABS = ["created", "offers-received", "collection", "activity"];

const TABS: NavItemProps[] = [
    {
        id: UserLandingTabEnum.Collected,
        label: "Collected",
        value: "collected",
    },
    {
        id: UserLandingTabEnum.Created,
        label: "Created",
        value: "created",
    },
    {
        id: UserLandingTabEnum.OnSale,
        label: "On Sale",
        value: "onsale",
    },
    {
        id: UserLandingTabEnum.OnAuction,
        label: "Auctions",
        value: ["auctions-created", "auctions-to-settle"],
    },
    {
        id: UserLandingTabEnum.Staked,
        label: "Staked",
        value: "staked",
    },
    {
        id: UserLandingTabEnum.Collections,
        label: "Collection",
        value: "collection",
    },
    {
        id: UserLandingTabEnum.Offers,
        label: "Offers",
        value: ["offers-received", "offers-made"],
    },
    {
        id: UserLandingTabEnum.Activity,
        label: "Activity",
        value: "activity",
    },
];

interface ProfileProviderProps {
    user: UserFragment; // TODO: this should be called profile instead
    userTokensCount: IUserTokensCount;
    referer: string | null;
    host: string | null;
}

const ProfileProvider: FC<ProfileProviderProps> = ({
    children,
    user,
    userTokensCount,
    referer,
    host,
}) => {
    const router = useRouter();
    const userData = useMemo(
        () => new UserData(user, userTokensCount),
        [user, userTokensCount]
    );

    // Set default tab based on user preferences
    const defaultTab =
        TABS.find((tab) => tab.id === user.landingTab) || TABS[0];

    const [state, setState] = useQueryParams({
        tab: withDefault(StringParam, defaultTab.value),
        page: withDefault(NumberParam, 1),
        query: withDefault(StringParam, ""),
        sort: withDefault(StringParam, undefined),
        // ^ We can't set a default value because it depends
        // on the selected tab. See `sort` value below.
        tokenType: withDefault(StringParam, TOKEN_TYPE_FILTER_OPTIONS[0].value),
        collectionId: withDefault(StringParam, undefined),
        properties: withDefault(SelectedTokenAttributesParam, undefined),
    });

    const stateKeys = useMemo(() => Object.keys(state), []);

    // Reset state when switching from one profile page to another
    // or when landing on the intial profile page (no query params)
    useEffect(() => {
        // If the previous page is `profile`
        if (referer?.includes("/profile/")) {
            // Compare profile urls
            const prevProfId = removeQueryParams(referer)
                .replace(/https?:\/\//, "")
                .replace(`${host}/profile/`, "");

            const curProfIds = [user.customUrl, user.address].filter(
                (id) => id != null
            );

            // When profile urls don't match or is initial profile page
            // (no query params), reset state
            const { identifier, ...queryParams } = router.query;

            if (!curProfIds.includes(prevProfId) || isEmpty(queryParams)) {
                setState(
                    stateKeys.reduce(
                        (obj, key) => ({ ...obj, [key]: undefined }),
                        {}
                    )
                );
            }
        }
    }, [user, stateKeys, setState, referer, host]);

    const setStateField = useCallback(
        (field: keyof typeof state) => (value: any) => {
            setState((prev) => {
                // Reset state whenever tab changes from/to RESET_TABS
                return field === "tab"
                    ? // If we hit the same tab...
                      prev.tab === value
                        ? // ...keep the old state
                          { ...prev }
                        : // If switching to a diff tab, which is not in the RESET_TABS list,...
                        !RESET_TABS.includes(prev.tab) &&
                          !RESET_TABS.includes(value)
                        ? // ...keep the old state...
                          { ...prev, page: 1, tab: value }
                        : // ...Otherwise, reset the whole state
                          {
                              // Set all state keys to `undefined` to clear up the state
                              ...stateKeys.reduce(
                                  (obj, key) => ({ ...obj, [key]: undefined }),
                                  {}
                              ),
                              tab: value,
                          }
                    : {
                          ...prev,
                          page: 1,
                          // ^ Reset page number when any of the filters change
                          [field]: value,
                      };
            });
        },
        [stateKeys, setState]
    );

    const setOptionField = useCallback(
        (field: keyof typeof state) => (opt: OptionItemProps) =>
            setStateField(field)(opt.value),
        [setStateField]
    );

    const sortOptions = useMemo(
        () =>
            state.tab === "auctions-created" ||
            state.tab === "auctions-to-settle"
                ? PROFILE_TAB_ON_AUCTION_SORT_OPTIONS
                : PROFILE_TAB_SORT_OPTIONS,
        [state.tab]
    );

    // When the selected tab has multiple values we return only the current
    // value instead of the whole array so we know which value is actually
    // selected.
    // TODO: use id instead
    const selectedTab = useMemo(() => {
        let selectedTab = findOrFallback(TABS, (t) =>
            Array.isArray(t.value)
                ? t.value.includes(state.tab)
                : t.value === state.tab
        );

        if (Array.isArray(selectedTab.value)) {
            selectedTab = {
                ...selectedTab,
                value:
                    selectedTab.value.find((v) => v === state.tab) ||
                    selectedTab.value[0],
            };
        }

        return selectedTab;
    }, [state.tab]);

    // When looking at auctions we want to sort by auction end time by default.
    useEffect(() => {
        if (selectedTab?.value === "auctions-created") {
            setOptionField("sort")(
                PROFILE_TAB_ON_AUCTION_SORT_OPTIONS.find(
                    (o) => o.value === "auction-ending-soon"
                )!
            );
        }
    }, [selectedTab.value, setOptionField]);

    return (
        <ProfileContext.Provider
            value={{
                user: userData,
                tabs: TABS,
                selectedTab,
                setSelectedTab: (tab: NavItemProps) =>
                    setStateField("tab")(
                        Array.isArray(tab.value) ? tab.value[0] : tab.value
                    ),
                sortOptions,
                selectedSort: findOrFallback(
                    sortOptions,
                    (o) => o.value === state.sort
                ),
                setSelectedSort: setOptionField("sort"),
                selectedTokenType: findOrFallback(
                    TOKEN_TYPE_FILTER_OPTIONS,
                    (o) => o.value === state.tokenType
                ),
                setSelectedTokenType: setOptionField("tokenType"),
                selectedCollectionId: state.collectionId,
                setSelectedCollectionId: setStateField("collectionId"),
                // End convert obj to string
                properties: state.properties,
                setProperties: setStateField("properties"),
                page: state.page,
                setPage: setStateField("page"),
                query: state.query,
                setQuery: setStateField("query"),
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);

export default ProfileProvider;
