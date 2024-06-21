import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "styled-components";

export type Data = {
    name: string;
    tickets: number;
    vouchers: number;
};

export type AdminChartProps = {
    data: Data[];
};

export const AdminChart = ({ data }: AdminChartProps) => {
    const theme = useTheme();
    const targetRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const getDimensions = () => {
        if (targetRef.current != null) {
            setDimensions({
                width: targetRef.current.offsetWidth,
                height: targetRef.current.offsetHeight,
            });
        }
    };

    useLayoutEffect(() => {
        getDimensions();
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", getDimensions);
        }
    }, []);

    return (
        <div ref={targetRef}>
            <BarChart
                width={dimensions.width}
                height={
                    dimensions.width < parseInt(theme.breakpoints.m!, 10)
                        ? 400
                        : 500
                }
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid vertical={false} opacity="0.2" />
                <XAxis
                    tick={{ fill: "black" }}
                    axisLine
                    tickLine
                    dataKey="name"
                />
                <YAxis
                    tickCount={7}
                    axisLine
                    tickLine
                    tick={{ fill: "black" }}
                    type="number"
                    domain={[0, 100]}
                />
                <Tooltip
                    viewBox={{ x: 0, y: 0, width: 20, height: 20 }}
                    cursor={false}
                    wrapperStyle={{ display: "hidden" }}
                />
                <Bar dataKey="tickets" fill="#82ca9d" />{" "}
                <Bar dataKey="vouchers" fill="#8884d8" />
            </BarChart>
        </div>
    );
};
