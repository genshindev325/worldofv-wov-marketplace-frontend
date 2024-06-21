import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import { useTranslation } from "next-i18next";
import { CountdownCircleTimer, Props } from "react-countdown-circle-timer";

export type CountdownProps = Pick<Props, "duration" | "size" | "onComplete">;

export function Countdown(props: CountdownProps) {
    const { t } = useTranslation();

    return (
        <CountdownCircleTimer
            isPlaying
            colors="#00A86B"
            // colorsTime={[7, 5, 2, 0]}
            {...props}
        >
            {({ remainingTime, color }) => (
                <Flex flexDirection="column" alignItems="center">
                    <Text>{t("business_claim:countdown.first_line")}</Text>
                    <Text variant="h3" color={color}>
                        {remainingTime % 60}
                    </Text>
                    <Text>{t("business_claim:countdown.second_line")}</Text>
                </Flex>
            )}
        </CountdownCircleTimer>
    );
}
