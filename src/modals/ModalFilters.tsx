import React, { ReactNode } from "react";
import AnimatedModal from "./AnimatedModal";

interface ModalFiltersProps {
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void;
    children?: ReactNode;
}

const ModalFilters: React.FC<ModalFiltersProps> = ({
    isOpen,
    setIsOpen,
    children,
}) => {
    return (
        <AnimatedModal small title="Filters" {...{ isOpen, setIsOpen }}>
            {children}
        </AnimatedModal>
    );
};

export default ModalFilters;
