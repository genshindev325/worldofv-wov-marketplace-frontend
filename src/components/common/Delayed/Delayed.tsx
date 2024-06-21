import { FC, ReactElement, useEffect, useState } from "react";

interface Props {
    children: ReactElement;
    wait?: number;
    deps?: any[];
}

export const Delayed: FC<Props> = ({ children, wait = 500, deps = [] }) => {
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShown(true);
        }, wait);
        return () => clearTimeout(timer);
    }, [wait, ...deps]);

    return isShown ? children : null;
};
