import { FC } from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#__next"); // this is for accessibility purpose. we want other page content to be hidden to assistive technology when this modal is opened

if (ReactModal.defaultStyles.overlay?.backgroundColor != null) {
    ReactModal.defaultStyles.overlay.backgroundColor = "rgba(35,38,47,0.9)";
}

interface ModalProps {
    children: any;
    open: boolean;
    onClose?: () => void;
    label?: string;
}

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        border: "unset",
        padding: 0,
        background: "transparent",
    },
};

export const Modal: FC<ModalProps> = ({ children, open, onClose, label }) => (
    <ReactModal
        isOpen={open}
        closeTimeoutMS={300}
        onRequestClose={onClose}
        contentLabel={label}
        style={customStyles}
    >
        {children}
    </ReactModal>
);
