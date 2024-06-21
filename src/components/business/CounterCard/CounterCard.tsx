import { Card, CardProps } from "@/components/cards/Card";
import { Text } from "@/components/common/Text";
import { createElement } from "react";
import { useTheme } from "styled-components";

export type CounterCardProps = CardProps & {
    Icon: (props: any) => JSX.Element;
    text: string;
    count: number;
};

export function CounterCard({
    Icon,
    text,
    count,
    ...cardProps
}: CounterCardProps) {
    const theme = useTheme();

    const iconProps = {
        size: 60,
        color: theme.colors.primary,
    };

    const iconElement = createElement(Icon, iconProps);

    return (
        <Card
            p={5}
            display="flex"
            flexDirection="column"
            alignItems="center"
            {...cardProps}
        >
            {iconElement}
            <Text variant="body2" fontWeight={600} mt={2}>
                {text}
            </Text>
            <Text variant="h2" mt={1}>
                {count}
            </Text>
        </Card>
    );
}
