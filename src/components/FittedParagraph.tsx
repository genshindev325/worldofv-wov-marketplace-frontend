import { FittyOptions } from "fitty";
import { HTMLAttributes, useEffect, useState } from "react";

const fitty = require("fitty/dist/fitty.min.js");

export interface FittedParagraphProps
    extends HTMLAttributes<HTMLParagraphElement> {
    fittyOptions?: FittyOptions;
}

export default function FittedParagraph({
    id,
    fittyOptions,
    ...props
}: FittedParagraphProps) {
    const [uniqueId] = useState(() => {
        if (id) return id;
        const random = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        return "paragraph-" + random;
    });

    useEffect(() => {
        fitty(`#${uniqueId}`, fittyOptions);
    }, [uniqueId, fittyOptions]);

    return <p id={uniqueId} {...props} />;
}
