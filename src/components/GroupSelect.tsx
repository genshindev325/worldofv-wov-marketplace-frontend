import Tippy from "@tippyjs/react/headless";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import styled from "styled-components";
import iconArrowDownDark from "../assets/arrow-down-dark.svg";
import iconArrowDownLight from "../assets/arrow-down-light.svg";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";

const { dark } = mixins;
const { colors, typography } = variables;
const { neutrals } = colors;

export interface Option {
    label: string;
    value: string;
}

export interface Group {
    label: string;
    value: string;
    options: Option[];
}

export interface GroupSelectProps {
    label?: string;
    content?: string;
    groups: Group[];
    selected?: Record<string, string>;
    onChange: (group: string, option: string) => void;
    className?: string;
}

const GroupSelect = ({
    label,
    content,
    groups,
    selected,
    onChange,
    className,
}: GroupSelectProps) => {
    const [visible, setVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const width = containerRef.current?.clientWidth;

    const onOptionClick = (group: string, option: string) => {
        setVisible(false);
        onChange?.(group, option);
    };

    return (
        <Tippy
            interactive
            appendTo={document.body}
            visible={visible}
            onClickOutside={() => setVisible(false)}
            offset={[0, 2]}
            placement="bottom"
            maxWidth={width}
            render={(attrs) => (
                <Dropdown
                    width={width}
                    groups={groups}
                    selected={selected}
                    onOptionClick={onOptionClick}
                    {...attrs}
                />
            )}
        >
            <RootContainer
                onClick={() => setVisible(!visible)}
                ref={containerRef}
                className={className}
            >
                <LabelContainer>
                    <Label>{label}</Label>
                </LabelContainer>
                <Content>{content}</Content>
                <ArrowButton open={visible} />
            </RootContainer>
        </Tippy>
    );
};

type DropdownProps = Pick<GroupSelectProps, "groups" | "selected"> & {
    width?: number;
    onOptionClick?: (group: string, option: string) => void;
    [attrs: string]: any;
};

const Dropdown = ({
    groups,
    selected,
    width,
    onOptionClick,
    ...attrs
}: DropdownProps) => {
    return (
        <DropdownContainer {...attrs} style={{ width }}>
            {groups.map((group) => [
                <DropdownGroup key={group.value}>{group.label}</DropdownGroup>,
                ...group.options.map((option: Option) => (
                    <DropdownOption
                        key={option.value}
                        onClick={() =>
                            onOptionClick?.(group.value, option.value)
                        }
                        selected={selected?.[group.value] === option.value}
                    >
                        {option.label}
                    </DropdownOption>
                )),
            ])}
        </DropdownContainer>
    );
};

const BaseContainer = styled.div`
    background: ${neutrals[8]};
    border-radius: ${({ theme }) => theme.radii[3]}px;
    border: 2px solid ${neutrals[6]};
    opacity: 1;
    font-size: 14px;
    font-weight: 500;
    line-height: 48px;

    ${dark`
        background: ${neutrals[1]};
        border-color:  ${neutrals[3]};
    `};
`;

const RootContainer = styled(BaseContainer)`
    height: 48px;
    padding-left: 16px;
    padding-right: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const DropdownContainer = styled(BaseContainer)`
    box-sizing: content-box;
    overflow: hidden;
`;

const ArrowButton = styled.button<{ open: boolean }>`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 2px ${neutrals[6]};
    background: url("${iconArrowDownLight.src}") no-repeat 50% 50% / 10px auto;
    transition: transform 0.2s;
    transform: rotate(${(props) => (props.open ? -180 : 0)}deg);

    ${dark`
        box-shadow: inset 0 0 0 2px ${neutrals[3]};
        background-image: url("${iconArrowDownDark.src}");
    `}
`;

const LabelContainer = styled.div`
    position: relative;
    background-color: inherit;
    height: 0;
    max-width: 0;
`;

const Label = styled.label`
    position: absolute;
    width: max-content;
    top: -34px;
    left: -4px;
    padding-inline: 4px;
    background-color: inherit;
    line-height: 100%;
    color: ${neutrals[5]};
    ${typography.caption2}
`;

const Content = styled.span`
    cursor: pointer;
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 0;
`;

const DropdownItem = styled.div`
    cursor: default;
    padding: 10px 14px;
    font-weight: 500;
`;

const DropdownGroup = styled(DropdownItem)`
    line-height: 2;
    color: ${neutrals[5]};

    ${dark`
        color: ${neutrals[4]};
    `}
`;

const DropdownOption = styled(DropdownItem)<{ selected?: boolean }>`
    cursor: pointer;
    line-height: 1.4;

    color: ${(props) => (props.selected ? colors.blue : undefined)};

    &:hover {
        background-color: ${neutrals[7]};

        ${dark`
            background-color: ${neutrals[2]};
        `}
    }
`;

export default dynamic(() => Promise.resolve(GroupSelect), { ssr: false });
