import { useContext, useState } from "react";
import ModalOffer from "../../../modals/ModalOffer";
import { TokenBatchSelectContext } from "../../../providers/BatchSelectProvider";
import { ActionButtonProps, BaseButton } from "../BaseButton";

// TODO: move this to offers folder or something like that
export const CollectionOffer: ActionButtonProps<any> = ({
    onClick = () => {},
    ...rest
}) => {
    const tokenContext = useContext(TokenBatchSelectContext);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <BaseButton
                label="Create Collection Offer"
                context={tokenContext}
                onClick={() => {
                    setIsOpen(true);
                    onClick();
                }}
                {...rest}
            />
            <ModalOffer
                offerType="COLLECTION"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </>
    );
};
