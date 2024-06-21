import { FC } from "react";
import { TOKEN_TYPE_FILTER_OPTIONS } from "../../../constants/marketplaceFilterOptions";
import { OptionItemProps, Select } from "../Select";

interface TokenTypeSelectProps {
    value: OptionItemProps;
    onChange?: (value: OptionItemProps) => void;
}

export const TokenTypeSelect: FC<TokenTypeSelectProps> = ({
    value,
    onChange = () => {},
}) => (
    <Select
        // label="Token Type"
        // labelInline
        inputProps={{
            options: TOKEN_TYPE_FILTER_OPTIONS,
            value,
            isSearchable: false,
            onChange: (value: OptionItemProps) => {
                onChange(value);
            },
        }}
    />
);
