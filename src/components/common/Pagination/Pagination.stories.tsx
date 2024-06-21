import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "./Pagination";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Pagination",
    component: Pagination,
    argTypes: {},
} as ComponentMeta<typeof Pagination>;

const PAGE_SIZE = 24;

export const Default: ComponentStory<typeof Pagination> = () => {
    const [page, setPage] = useState(1);

    return (
        <Pagination
            currentPage={page}
            pageSize={PAGE_SIZE} // number of items to be displayed on the page
            totalCount={PAGE_SIZE * 10} // total number of items. From here we derive the number of pages (totalCount/pageSize)
            onPageChange={setPage}
        />
    );
};
