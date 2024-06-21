import { useEffect } from "react";
import styled from "styled-components";

export function WheelAnimation() {
    useEffect(() => {
        const svgEl = document.getElementById("spinning-wheel-svg");
        const percentage = 100 / 12 / 100;
        const slices = [
            { percent: percentage, color: "#FBB21C" },
            { percent: percentage, color: "#E78A30" },
            { percent: percentage, color: "#D3513C" },
            { percent: percentage, color: "#F26141" },
            { percent: percentage, color: "#AE6D96" },
            { percent: percentage, color: "#8A6D96" },
            { percent: percentage, color: "#A286AE" },
            { percent: percentage, color: "#71BADF" },
            { percent: percentage, color: "#65AAC7" },
            { percent: percentage, color: "#7D9A49" },
            { percent: percentage, color: "#96BA59" },
            { percent: percentage, color: "#FFEB65" },
        ];
        let cumulativePercent = 0;

        function getCoordinatesForPercent(percent: number) {
            const x = Math.cos(2 * Math.PI * percent);
            const y = Math.sin(2 * Math.PI * percent);
            return [x, y];
        }

        slices.forEach((slice) => {
            // destructuring assignment sets the two variables at once
            const [startX, startY] =
                getCoordinatesForPercent(cumulativePercent);

            // each slice starts where the last slice ended, so keep a cumulative percent
            cumulativePercent += slice.percent;

            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

            // if the slice is more than 50%, take the large arc (the long way around)
            const largeArcFlag = slice.percent > 0.5 ? 1 : 0;

            // create an array and join it just for code readability
            const pathData = [
                `M ${startX} ${startY}`, // Move
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                `L 0 0`, // Line
            ].join(" ");

            // create a <path> and append it to the <svg> element
            const pathEl = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );
            pathEl.setAttribute("d", pathData);
            pathEl.setAttribute("fill", slice.color);
            svgEl?.appendChild(pathEl);
        });
    }, []);

    return (
        <Container>
            <div className="wrapper">
                <svg
                    id="spinning-wheel-svg"
                    viewBox="-1 -1 2 2"
                    style={{ transform: "rotate(-90deg)" }}
                ></svg>
            </div>
        </Container>
    );
}

const Container = styled.div`
    .wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    svg {
        position: relative;
        max-width: 500px;
        /*the contents will scale to fit because of viewBox*/
        width: 40%;
        animation-name: rotate;
        animation-duration: 2.5s;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.9, 0.005, 0.2, 1);
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(1080deg);
        }
    }
`;
