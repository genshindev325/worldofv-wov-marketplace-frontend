import { FC } from "react";
import styled, {
    css,
    FlattenSimpleInterpolation,
    useTheme,
} from "styled-components";
import { colors } from "../../../styles/theme";

interface DividerProps {
    /** x = left-to-right divider. Default is top-to-bottom */
    x?: boolean;
    /** Border color */
    color?: keyof typeof colors;
    /** Width */
    width?: number;
}

export const Divider: FC<DividerProps> = ({
    x = false,
    color = "muted",
    width = 1,
}) => {
    const theme = useTheme();

    const style = css`
        border-bottom: ${x ? 0 : `${width}px`} solid ${theme.colors[color]};
        border-right: ${!x ? 0 : `${width}px`} solid ${theme.colors[color]};
        display: ${!x ? "block" : "inline"};
    `;

    return <StyledDiv styl={style} />;
};

const StyledDiv = styled.div<{ styl: FlattenSimpleInterpolation }>`
    ${(props) => props.styl}
`;
