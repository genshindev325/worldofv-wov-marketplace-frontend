import React from "react";
import styled from "styled-components";
import useConvertPrices from "../../../hooks/useConvertPrices";
import mixins from "../../../styles/_mixins";
import variables from "../../../styles/_variables";
import { useDashBoard } from "../DashBoardProvider";

const { dark } = mixins;
const {
    colors: { neutrals },
    typography: { body1, bodyBold1 },
    breakpoints,
} = variables;

const DashboardUnclaimedWov: React.FC = () => {
    const { earnedWoV } = useDashBoard();

    const convertedPrices = useConvertPrices([earnedWoV], "WoV");
    return (
        <Container>
            <NeonLights>
                <div className="wov__generation__gradient"></div>
            </NeonLights>
            <Circle>
                <Title>Unclaimed WoV</Title>
                <Quantity>
                    {convertedPrices && convertedPrices[0]?.formattedPrices.WoV}
                </Quantity>
                <Conversion>
                    {convertedPrices && convertedPrices[0]?.formattedPrices.VET}{" "}
                    VET
                </Conversion>
            </Circle>
        </Container>
    );
};

const Container = styled.div`
    padding: 50px;
    position: relative;
`;

const NeonLights = styled.div`
    width: 350px;
    height: 350px;
    top: 15px;
    left: 15px;
    position: absolute;
    -webkit-mask-image: url("data:image/svg+xml,%3csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' x='0' y='0' viewBox='0 0 407 406.6' style='enable-background:new 0 0 407 406.6' xml:space='preserve'%3e%3cstyle%3e.st0%7bfill:%231d1d1b%7d%3c/style%3e%3cswitch%3e%3cg%3e%3cpath class='st0' d='M155 17c2 5 7 8 12 7a183 183 0 0 1 219 193c0 5 3 9 8 11 6 1 12-3 12-10A203 203 0 0 0 163 4c-6 1-9 7-8 13zM391 248c-5-1-10 2-12 7a183 183 0 0 1-290 91c-4-3-10-2-14 1-4 5-3 11 1 15a203 203 0 0 0 322-102c2-5-1-11-7-12zM62 333c3-4 3-9 0-13a183 183 0 0 1 69-284c4-2 7-7 5-12-2-6-8-9-13-7a203 203 0 0 0-76 315c3 5 11 5 15 1z'/%3e%3c/g%3e%3c/switch%3e%3c/svg%3e");
    mask-image: url("data:image/svg+xml,%3csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' x='0' y='0' viewBox='0 0 407 406.6' style='enable-background:new 0 0 407 406.6' xml:space='preserve'%3e%3cstyle%3e.st0%7bfill:%231d1d1b%7d%3c/style%3e%3cswitch%3e%3cg%3e%3cpath class='st0' d='M155 17c2 5 7 8 12 7a183 183 0 0 1 219 193c0 5 3 9 8 11 6 1 12-3 12-10A203 203 0 0 0 163 4c-6 1-9 7-8 13zM391 248c-5-1-10 2-12 7a183 183 0 0 1-290 91c-4-3-10-2-14 1-4 5-3 11 1 15a203 203 0 0 0 322-102c2-5-1-11-7-12zM62 333c3-4 3-9 0-13a183 183 0 0 1 69-284c4-2 7-7 5-12-2-6-8-9-13-7a203 203 0 0 0-76 315c3 5 11 5 15 1z'/%3e%3c/g%3e%3c/switch%3e%3c/svg%3e");
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    .wov__generation__gradient {
        width: 100%;
        height: 100%;
        background: linear-gradient(
                45deg,
                #2ce6b8,
                #2ce6b8,
                #53c0ca,
                black,
                #ffb200,
                #ffb200
            )
            left/100% 100%;
        animation: rotate 10s linear infinite;
    }
    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }

    @media only screen and (max-width: ${breakpoints.s}) {
        width: 300px;
        height: 300px;
    }
`;

const Circle = styled.div`
    height: 280px;
    width: 280px;
    background-color: ${neutrals[6]};
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    ${dark`
        background-color: ${neutrals[4]};
    `}

    @media only screen and (max-width: ${breakpoints.s}) {
        width: 230px;
        height: 230px;
    }
`;

const Title = styled.p`
    ${body1}
    font-weight: 400;
`;

const Quantity = styled.p`
    ${bodyBold1}
    padding: 30px 0;
    font-size: 30px;
`;

const Conversion = styled.p`
    font-size: 16px;
`;

export default DashboardUnclaimedWov;
