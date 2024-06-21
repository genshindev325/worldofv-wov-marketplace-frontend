import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";
import CircleButton from "../../CircleButton";
import { Button } from "../../common/Button";
import Switch from "../../FormInputs/Switch";
import Icon from "../../Icon";

interface ThemeButtonProps {
    variant?: "button" | "circle" | "switch";
}

export const ThemeButton: FC<ThemeButtonProps> = ({ variant = "button" }) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    if (variant === "circle") {
        return (
            <CircleButton small outline onClick={toggleTheme}>
                <Icon icon="bulb" />
            </CircleButton>
        );
    }

    if (variant === "switch") {
        return (
            <Switch
                small
                inputProps={{
                    checked: theme === "dark",
                    onChange: toggleTheme,
                }}
            />
        );
    }

    return (
        <Button outline onClick={toggleTheme}>
            <Icon icon="bulb" />
            <span>Toggle Theme</span>
        </Button>
    );
};
