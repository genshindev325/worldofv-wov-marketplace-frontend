import React from "react";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import ActionCard from "../ActionCard";
import { Button } from "../common/Button";
import Link from "../Link";
import { LinkedCollectionsProps } from "./LinkedCollectionData";

const { media } = mixins;
const { dark } = mixins;
const {
    colors: { blue, neutrals },
    typography: { captionBold1, caption1 },
} = variables;

interface LinkedCollectionProps {
    hasMultipleLinkedCollections: boolean;
    linkedCollections: LinkedCollectionsProps[];
}

const LinkedCollection: React.FC<LinkedCollectionProps> = ({
    hasMultipleLinkedCollections,
    linkedCollections,
}) => {
    const formatCollectionName = React.useCallback((collectionName: string) => {
        if (collectionName === "New Pigs Order - Slaughterhouse") {
            return "NPO - Slaughterhouse";
        }

        return collectionName;
    }, []);

    if (!linkedCollections.length) {
        return null;
    }

    return (
        <ActionCard
            description={
                hasMultipleLinkedCollections === true
                    ? "Linked Collections"
                    : "Linked Collection"
            }
        >
            {linkedCollections.map((item) => (
                <Link
                    key={item.customUrl}
                    href={`/collection/${item.customUrl}`}
                    passHref
                >
                    <Button small fullWidth>
                        {formatCollectionName(item.name)}
                    </Button>
                </Link>
            ))}
        </ActionCard>
    );
};

export default LinkedCollection;
