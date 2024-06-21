import React from "react";
import ModalCollectionProperties, {
    ModalCollectionPropertiesProps,
} from "../../modals/ModalCollectionProperties";
import { PropertiesInput } from "../FormInputs/PropertiesInput";

interface CollectionFilterProps
    extends Pick<
        ModalCollectionPropertiesProps,
        "options" | "selectedProperties" | "onSelectProperties"
    > {}

const CollectionFilterByTraitsButton = (props: CollectionFilterProps) => {
    const [isPropertiesModalOpen, setIsPropertiesModalOpen] =
        React.useState(false);

    if (!props.options?.length) {
        return null;
    }

    return (
        <>
            <PropertiesInput onClick={() => setIsPropertiesModalOpen(true)} />

            <ModalCollectionProperties
                isOpen={isPropertiesModalOpen}
                setIsOpen={setIsPropertiesModalOpen}
                {...props}
            />
        </>
    );
};

export default CollectionFilterByTraitsButton;
