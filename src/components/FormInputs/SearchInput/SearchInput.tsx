import { FC } from "react";
import { Input, InputProps } from "../Input";

interface SearchInputProps extends Omit<InputProps, "inputProps"> {
    value: string;
    placeholder?: string;
    onSearch?: (value: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({
    value,
    placeholder = "",
    onSearch = () => {},
    ...rest
}) => {
    return (
        <Input
            // label="Search"
            inputProps={{
                name: "query",
                value,
                placeholder,
                onChange: (e) => onSearch(e.target.value),
            }}
            {...rest}
        />
    );
};
