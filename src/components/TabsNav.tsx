import clsx from "clsx";
import React from "react";
import styled, { css } from "styled-components";
import { FreeMode, Mousewheel, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { Button_Style2 } from "./common/Button";
import Icon from "./Icon";

const { media, dark } = mixins;
const {
    colors: { neutrals },
} = variables;

export interface NavTabItemProps {
    id?: string;
    label: string;
    value?: any;
}

interface NavProps {
    className?: string;
    style?: React.CSSProperties;
    items: string[] | NavTabItemProps[];
    defaultSelected?: string;
    onChange?: (value: NavTabItemProps) => void;
    value?: string;
}

const TabsNav: React.FC<NavProps> = ({
    items,
    defaultSelected,
    onChange,
    style,
    value: controlledValue,
    className,
}) => {
    const [active, setActive] = React.useState<string | undefined>(
        defaultSelected || undefined
    );

    const onPillClick = (value: NavTabItemProps) => {
        setActive(value.label);

        if (typeof onChange === "function") {
            onChange(value);
        }
    };

    return (
        <Container {...{ style, className }}>
            <SwiperButton className="TabsNav__Prev">
                <Icon icon="arrow-left" />
            </SwiperButton>

            <Swiper
                modules={[Navigation, FreeMode, Mousewheel]}
                direction="horizontal"
                mousewheel={{ forceToAxis: true }}
                slidesPerView="auto"
                spaceBetween={16}
                navigation={{
                    prevEl: ".TabsNav__Prev",
                    nextEl: ".TabsNav__Next",
                }}
            >
                {items.map((item: any) => {
                    const id = "id" in item ? item.id : undefined;
                    const label = "label" in item ? item.label : item;
                    const value = "value" in item ? item.value : undefined;

                    return (
                        <SwiperSlide key={label}>
                            <Pill
                                onClick={() =>
                                    onPillClick({ id, label, value })
                                }
                                className={clsx({
                                    active:
                                        label === (controlledValue || active),
                                })}
                            >
                                {label}
                            </Pill>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <SwiperButton className="TabsNav__Next">
                <Icon icon="arrow-right" />
            </SwiperButton>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    margin: 0;

    .swiper {
        margin: auto 0;

        .swiper-slide {
            width: auto;
        }
    }

    ${media.m`
        overflow: auto;
        overflow-x: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;

        &::-webkit-scrollbar {
            display: none;
        }
    `}
`;

const SwiperButton = styled.button`
    transition: all 0.2s;

    &.TabsNav__Prev {
        margin-right: 12px;
    }

    &.TabsNav__Next {
        margin-left: 12px;
    }
`;

const PillActive = css`
    background: ${neutrals[3]};
    color: ${neutrals[8]} !important;

    ${dark`
        background: ${neutrals[8]} !important;
        color: ${neutrals[2]} !important;
    `}
`;

const Pill = styled.a`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 6px 12px;
    border-radius: 14px;
    background: none;
    ${Button_Style2};
    color: ${neutrals[4]};
    transition: all 0.2s;

    ${media.m`
        margin: 0;
    `}

    &:hover {
        color: ${neutrals[3]};

        ${dark`
            color: ${neutrals[6]};
        `}
    }

    &.active {
        ${PillActive}
    }
`;

export default TabsNav;
