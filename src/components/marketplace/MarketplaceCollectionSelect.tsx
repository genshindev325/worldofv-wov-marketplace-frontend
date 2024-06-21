import { useRouter } from "next/router";
import { ICollectionData } from "../../types/CollectionData";
import { removeQueryParams } from "../../utils/removeQueryParams";
import CollectionSelect, { CollectionSelectProps } from "../CollectionSelect";

export type MarketplaceCollectionSelectProps = Pick<
    CollectionSelectProps,
    "selectedCollectionId" | "className"
>;

// TODO: move this to the FormInputs folder
export default function MarketplaceCollectionSelect(
    props: MarketplaceCollectionSelectProps
) {
    const router = useRouter();

    const navigateToCollection = (c: ICollectionData | null): void => {
        if (c) {
            const path = `/collection/${c.customUrl || c.id || c.collectionId}`;
            // Only push a new route when paths are different
            if (removeQueryParams(router.asPath) !== path) router.push(path);
        }
    };

    return (
        <CollectionSelect
            {...props}
            onSelectCollection={navigateToCollection}
        />
    );
}
