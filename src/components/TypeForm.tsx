import { useMediaQuery } from "@react-hook/media-query";
import { Popover } from "@typeform/embed-react";
import { useTheme } from "styled-components";

const TypeForm = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.m})`);

    return (
        <Popover
            id="f3C9SoNM"
            chat={true}
            hidden={{ foo: "foo value", bar: "bar value" }}
            medium="snippet"
            // tooltip={
            //     !isSmallScreen
            //         ? "Hey 👋&nbsp;&nbsp;Get a chance of winning a MVA Alpha now!"
            //         : undefined
            // }
            buttonColor="#3772FF" // TODO: use theme.colors.primary
            notificationDays={1}
        />
    );
};

export default TypeForm;
