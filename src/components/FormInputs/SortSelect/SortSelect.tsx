import { FC } from "react";
import { OptionItemProps, Select, SelectProps } from "../Select";

interface SortSelectProps extends SelectProps {
    options: OptionItemProps[];
    value: OptionItemProps;
    fullWidth?: boolean;
    onChange?: (value: OptionItemProps) => void;
}

export const SortSelect: FC<SortSelectProps> = ({
    options,
    value,
    fullWidth = false,
    onChange = () => {},
}) => {
    return (
        <Select
            label="Sort"
            labelInline
            className={fullWidth ? "full-width" : ""}
            inputProps={{
                options,
                value,
                isSearchable: false,
                onChange: (value: OptionItemProps) => {
                    onChange(value);
                },
            }}
        />
    );
};
