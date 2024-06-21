import { useTheme } from "next-themes";
import React, { FC, useEffect } from "react";

interface ThemeChangerProps {
    theme: "light" | "dark";
}

/**
 * Required to make Storybook-theme-switch to play nicely with
 * next-themes
 */
const ThemeChanger: FC<ThemeChangerProps> = ({ theme }) => {
    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme(theme);
    }, [setTheme, theme]);

    return null;
};

export default React.memo(ThemeChanger);
