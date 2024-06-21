import ReactCountdown, {
    CountdownProps,
    CountdownRenderProps,
} from "react-countdown";
import styled from "styled-components";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";

const { dark } = mixins;
const { colors } = variables;
const { neutrals } = colors;

const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
}: CountdownRenderProps) => {
    if (completed) return <CountdownValue>Expired</CountdownValue>;

    const { value, label } = [
        { value: days, label: "days" },
        { value: hours, label: "hours" },
        { value: minutes, label: "minutes" },
        { value: seconds, label: "seconds" },
    ].find(({ value }) => value > 1)!;

    return (
        <CountdownContainer>
            <CountdownValue>
                <CountdownNumber>{value}</CountdownNumber>
                &nbsp;{label}
            </CountdownValue>
        </CountdownContainer>
    );
};

export default function Countdown({ date }: Pick<CountdownProps, "date">) {
    return (
        <ReactCountdown
            key={date?.toString()}
            date={date}
            renderer={renderer}
        />
    );
}

const CountdownContainer = styled.div`
    display: flex;

    > *:not(:first-child) {
        margin-left: 2px;
    }
`;

const CountdownValue = styled.div`
    display: flex;
    align-items: flex-end;
    font-weight: 500;
    letter-spacing: 1px;
`;

const CountdownNumber = styled.div`
    font-weight: 600;
    color: ${neutrals[3]};

    ${dark`
        color: ${neutrals[8]};
    `}
`;
