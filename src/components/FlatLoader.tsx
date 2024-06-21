import { RiLoader4Fill } from "react-icons/ri";
import styled from "styled-components";

const FlatLoader = styled(RiLoader4Fill)`
    animation: spin 400ms linear infinite;

    @keyframes spin {
        100% {
            transform: rotate(360deg);
        }
    }
`;

export default FlatLoader;
