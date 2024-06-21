import clsx from "clsx";
import React from "react";
import styled from "styled-components";

interface Props extends React.HTMLAttributes<HTMLElement> {
    icon: string;
    size?: number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
}

const Icon = React.forwardRef<HTMLElement, Props>(
    ({ icon, className, color, size, ...attrs }, ref) => (
        <IconComponent
            className={clsx("icon", `icon-${icon}`, className)}
            ref={ref}
            {...{ color, size, ...attrs }}
        />
    )
);

Icon.displayName = "Icon";

const IconComponent = styled.i<{ size?: number; color?: string }>`
    display: inline-block;
    color: ${({ color }) => color || "inherit"};
    font-size: ${({ size }) => (size ? `${size}px` : "inherit")} !important;
    vertical-align: middle;
`;

export default Icon;
