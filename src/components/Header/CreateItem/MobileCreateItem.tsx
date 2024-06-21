import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Popup } from "@/components/common/Popup";
import Link from "@/components/Link";
import { useState } from "react";

interface MobileCreateItemProps {
    showAlert: boolean;
    label?: string;
    href?: string;
    passHref?: boolean;
}

const MobileCreateItem: React.FC<MobileCreateItemProps> = ({
    showAlert,
    label,
    href,
    passHref,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    if (showAlert) {
        return (
            <Popup
                visible={isVisible}
                onClickOutside={() => setIsVisible(false)}
                interactive
                rounded
                content={
                    <Link href="/profile/edit" passHref>
                        <a>
                            <Alert
                                title="Your profile is not complete"
                                text="To be able to mint please update your profile details"
                            />
                        </a>
                    </Link>
                }
            >
                <Button onClick={() => setIsVisible(!isVisible)}>
                    {label}
                </Button>
            </Popup>
        );
    }
    return (
        <Link href={href} passHref={passHref}>
            <Button>{label}</Button>
        </Link>
    );
};

export default MobileCreateItem;
