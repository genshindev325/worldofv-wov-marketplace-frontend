import styled from "styled-components";
import { Button } from "../../components/common/Button";

export const SmallButton = styled(Button)`
    ${({ theme }) => theme.typography.hairline2}
    height: 24px;
    border-radius: ${({ theme }) => theme.radii[3]}px;
    padding: 0 16px;
    font-size: 12px;
    text-transform: uppercase;
`;
