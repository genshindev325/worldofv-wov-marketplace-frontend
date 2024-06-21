import { useTheme } from "next-themes";
import ContentLoader, { IContentLoaderProps } from "react-content-loader";

export default function BasePlaceholder(props: IContentLoaderProps = {}) {
    const { theme } = useTheme();

    const backgroundColor =
        theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

    const foregroundColor =
        theme === "dark" ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.14)";

    return (
        <ContentLoader
            width="100%"
            height="100%"
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
            {...props}
        />
    );
}
