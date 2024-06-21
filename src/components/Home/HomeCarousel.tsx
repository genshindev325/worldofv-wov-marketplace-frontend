import useGraphQL from "@/hooks/useGraphQL";
import React from "react";
import styled from "styled-components";
import { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import useSWR from "swr";
import { HomeBannerFragment } from "../../generated/graphql";
import mixins from "../../styles/_mixins";
import Link from "../Link";

const { media } = mixins;

const Banner: React.FC<HomeBannerFragment> = ({
    image,
    artist,
    collectionId,
    url,
}) => {
    const href = url
        ? url
        : artist
        ? `/profile/${artist}`
        : collectionId
        ? `/collection/${collectionId}`
        : undefined;

    return (
        <Link {...{ href }} passHref>
            <ImageContainer style={href ? { cursor: "pointer" } : undefined}>
                <img src={image} alt="" />
            </ImageContainer>
        </Link>
    );
};

const HomeCarousel = () => {
    const { sdk } = useGraphQL();
    const { data } = useSWR("HOME_BANNERS", () => sdk.GetHomeBanners());

    if (!data?.banners?.length) return null;

    return (
        <Container>
            <Swiper
                loop={true}
                pagination={{ clickable: true }}
                modules={[Pagination, Navigation, Mousewheel, Autoplay]}
                navigation={{
                    prevEl: ".HomeCarousel__Prev",
                    nextEl: ".HomeCarousel__Next",
                }}
                direction="horizontal"
                mousewheel={{ forceToAxis: true }}
                spaceBetween={64}
                slidesPerView={1}
                autoplay={{ delay: 6000 }}
            >
                {data.banners.map((props) => (
                    <SwiperSlide key={props.id}>
                        <Banner {...props} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/*            <CircleButton outline className="HomeCarousel__Prev">
                <Icon icon="arrow-left" />
            </CircleButton>

            <CircleButton outline className="HomeCarousel__Next">
                <Icon icon="arrow-right" />
            </CircleButton>*/}
        </Container>
    );
};

const Container = styled.div`
    max-width: 100%;
    position: relative;
    padding: 0 calc(48px + 24px);
    padding-right: 0;

    @media screen and (max-width: ${({ theme }) => theme.breakpoints.t}) {
        margin-top: 20px;

        padding: 0;

        .HomeCarousel__Prev,
        .HomeCarousel__Next {
            display: none;
        }
    }

    .swiper-wrapper {
        margin-bottom: 50px;

        .swiper-slide {
            border-radius: 16px;
            overflow: hidden;
        }
    }
    .swiper-pagination-bullet {
        width: 50px;
        @media screen and (max-width: ${({ theme }) => theme.breakpoints.t}) {
            width: 40px;
        }
        height: 5px;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        color: #000;
        opacity: 1;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 0;
        background: ${({ theme }) => theme.colors.muted};
    }

    .swiper-pagination-bullet-active {
        color: #fff;
        background: #007aff;
    }

    .HomeCarousel__Prev,
    .HomeCarousel__Next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }

    .HomeCarousel__Prev {
        left: 0;
    }

    .HomeCarousel__Next {
        right: 0;
    }
`;

const ImageContainer = styled.span`
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

export default HomeCarousel;
