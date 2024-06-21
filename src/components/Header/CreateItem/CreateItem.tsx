import { Alert } from "@/components/common/Alert";
import { useUserData } from "@/hooks/useUserData";
import { FC, useEffect, useState } from "react";
import { usePopupHandler } from "../../../hooks/usePopupHandler";
import { Button } from "../../common/Button";
import { Popup } from "../../common/Popup";
import { PopupLinkItems } from "../../common/PopupLinkItems";
import Link from "../../Link";
import MobileCreateItem from "./MobileCreateItem";
import { getCreateItems } from "./utils";

// TODO: change name to `view`?
interface CreateItemProps {
    variant: "mobile" | "desktop";
}

const ITEMS = getCreateItems();

export const CreateItem: FC<CreateItemProps> = ({ variant }) => {
    const { visible, hide, handleEvent } = usePopupHandler();

    const { user } = useUserData();

    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        user?.name ? setShowAlert(false) : setShowAlert(true);
    }, [setShowAlert, user?.name]);

    if (variant === "mobile") {
        return (
            <>
                {ITEMS.map(({ label, href, passHref }) => (
                    <MobileCreateItem
                        key={label}
                        label={label}
                        href={href}
                        passHref={passHref}
                        showAlert={showAlert}
                    />
                ))}
            </>
        );
    }

    return (
        <Popup
            placement="bottom"
            interactive
            visible={visible}
            onClickOutside={hide}
            rounded
            content={
                showAlert ? (
                    <Alert
                        title="Your profile is not complete"
                        text={
                            <>
                                To be able to mint please{" "}
                                <Link href="/profile/edit" passHref>
                                    <a>update your profile</a>
                                </Link>{" "}
                                details
                            </>
                        }
                    />
                ) : (
                    <PopupLinkItems items={ITEMS} rounded />
                )
            }
        >
            <Button small onClick={handleEvent}>
                Create
            </Button>
        </Popup>
    );
};
