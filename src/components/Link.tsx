import NextLink, { LinkProps } from "next/link";
import React from "react";

const Link = ({
    href,
    children,
    ...props
}: React.PropsWithChildren<LinkProps | { href?: string }>): JSX.Element =>
    (href ? (
        <NextLink {...{ href }} {...props}>
            {children}
        </NextLink>
    ) : (
        children!
    )) as JSX.Element;

export default Link;
