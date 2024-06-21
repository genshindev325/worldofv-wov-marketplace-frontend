import { Flex, FlexProps } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import Switch from "@/components/FormInputs/Switch";
import { FC } from "react";

export type SwitchInputProps = FlexProps & {
    label: string;
    checked: boolean;
    onChange?: (evt: any) => void;
};

export const SwitchInput: FC<SwitchInputProps> = ({
    label,
    checked,
    onChange,
    ...flexProps
}) => (
    <Flex
        alignItems="center"
        justifyContent="space-between"
        border="2px solid"
        borderColor="muted"
        borderRadius={3}
        px={14}
        py={10}
        rowGap={1}
        {...flexProps}
    >
        <Text>{label}</Text>
        <Switch
            inputProps={{
                checked,
                onChange,
            }}
        />
    </Flex>
);
