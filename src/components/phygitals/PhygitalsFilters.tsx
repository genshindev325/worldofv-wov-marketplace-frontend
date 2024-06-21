import { Box } from "@/components/common/Box";
import { Flex } from "@/components/common/Flex";
import { SwitchInput } from "@/components/FormInputs/SwitchInput";
import GroupSelect from "@/components/GroupSelect";
import {
    CREATOR_OPTIONS,
    FILTER_SORT_OPTIONS,
    SORT_OPTIONS,
} from "@/constants/marketplaceFilterOptions";
import { usePhygitals } from "@/providers/PhygitalsProvider";

export const PhygitalsFilters = () => {
    const {
        showOnSaleOnly,
        setShowOnSaleOnly,
        selectedCreator,
        setSelectedCreator,
        selectedSort,
        setSelectedSort,
    } = usePhygitals();

    const handleChangeFilterSortOptions = (group: string, option: string) => {
        switch (group) {
            case "filter":
                return setSelectedCreator(
                    CREATOR_OPTIONS.find((o: any) => o.value === option)!
                );
            case "sort":
                return setSelectedSort(
                    SORT_OPTIONS.find((o: any) => o.value === option)!
                );
        }
    };
    return (
        <Flex
            flexDirection={{ _: "column", m: "row" }}
            alignItems="center"
            flexWrap="wrap"
            rowGap={{ _: 0, m: 2 }}
            columnGap={{ _: 2, m: 0 }}
        >
            <Box width={{ _: "100%", m: 200 }}>
                <GroupSelect
                    label="Filter &amp; Sort"
                    content={selectedSort.label}
                    groups={FILTER_SORT_OPTIONS}
                    onChange={handleChangeFilterSortOptions}
                    selected={{
                        filter: selectedCreator.value,
                        sort: selectedSort.value,
                    }}
                />
            </Box>
            <Flex flex={1} rowGap={2} width="100%">
                <SwitchInput
                    label="Listed only"
                    checked={showOnSaleOnly}
                    onChange={(e: any) => {
                        setShowOnSaleOnly(e.target.checked);
                    }}
                    width={{ _: "100%", m: 200 }}
                />
            </Flex>
        </Flex>
    );
};
