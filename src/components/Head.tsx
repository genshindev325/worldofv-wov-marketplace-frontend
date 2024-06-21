import { useTheme } from "next-themes";
import NextHead from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

const FALLBACK_DESCRIPTION =
    "The first and largest #GreenNFTs marketplace on VeChain. Create & collect with 0 gas fees.";

const FALLBACK_IMAGE = `https://marketplace.worldofv.art/img/world-of-v.jpg`;

export interface HeadProps {
    title: string;
    description?: string | null;
    image?: string | null;
}

export default function Head({ title, description, image }: HeadProps) {
    const fullTitle = `${title} | World of V`;

    const router = useRouter();
    const { theme } = useTheme();

    const url = useMemo(
        () => "https://marketplace.worldofv.art" + router.asPath.split("?")[0],
        [router.asPath]
    );

    return (
        <NextHead>
            <title>{fullTitle}</title>

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />

            <meta
                name="theme-color"
                content={theme === "dark" ? "#141416" : "#fcfcfd"}
            />

            <meta property="og:url" key="og:url" content={url} />
            <meta property="og:title" key="og:title" content={fullTitle} />
            <meta
                property="og:description"
                key="og:description"
                content={description || FALLBACK_DESCRIPTION}
            />
            <meta
                property="og:image"
                key="og:image"
                content={image || FALLBACK_IMAGE}
            />
            <meta name="twitter:card" content="summary" />
        </NextHead>
    );
}
