import { uniqueId } from "lodash";
import React, { useMemo } from "react";
import { Mousewheel, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/navigation";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";
import CircleButton from "../CircleButton";
import { Box } from "../common/Box";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import Icon from "../Icon";

export interface HomeSwiperProps<T> {
    title: string | React.ReactNode;
    items?: T[];
    ItemComponent: React.ComponentType<T>;
    PlaceholderComponent: React.ComponentType;
    placeholderCount?: number;
    swiperProps?: SwiperProps;
    decorator?: React.ReactNode;
}

export default function HomeSwiper<T extends {}>({
    title,
    items,
    ItemComponent,
    PlaceholderComponent,
    placeholderCount = 10,
    swiperProps,
    decorator,
}: HomeSwiperProps<T>) {
    const backButtonId = useMemo(() => uniqueId("swiper-nav-"), []);
    const forwardButtonId = useMemo(() => uniqueId("swiper-nav-"), []);

    return (
        <Box position="relative">
            <Flex
                justifyContent="space-between"
                alignItems="center"
                marginBottom={2}
            >
                {typeof title === "string" ? (
                    <Text variant="h3" fontSize={{ _: 5, m: 6, d: 7 }}>
                        {title}
                    </Text>
                ) : (
                    title
                )}

                <Flex rowGap={3}>
                    {decorator}

                    <CircleButton outline id={backButtonId}>
                        <Icon icon="arrow-left" />
                    </CircleButton>

                    <CircleButton outline id={forwardButtonId}>
                        <Icon icon="arrow-right" />
                    </CircleButton>
                </Flex>
            </Flex>

            <Swiper
                {...swiperProps}
                modules={[Navigation, Mousewheel]}
                direction="horizontal"
                mousewheel={{ forceToAxis: true }}
                spaceBetween={32}
                style={{ paddingBottom: 16 }}
                navigation={{
                    prevEl: "#" + backButtonId,
                    nextEl: "#" + forwardButtonId,
                }}
            >
                {items
                    ? items.map((item, i) => (
                          <SwiperSlide key={i}>
                              <ItemComponent {...item} />
                          </SwiperSlide>
                      ))
                    : Array.from({ length: placeholderCount }, (_, i) => (
                          <SwiperSlide key={i}>
                              <PlaceholderComponent />
                          </SwiperSlide>
                      ))}
            </Swiper>
        </Box>
    );
}
