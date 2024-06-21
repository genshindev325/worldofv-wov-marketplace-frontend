import { darken } from "polished";
import styled from "styled-components";
import { Mousewheel, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";

const { containerLarge } = common;
const { media, dark } = mixins;
const {
    colors: { neutrals, blue },
    typography: { bodyBold2 },
} = variables;

const HomeFooter = () => (
    <Wrapper>
        <Container>
            <Swiper
                modules={[Navigation, Mousewheel]}
                navigation={{
                    prevEl: ".HomeFooter_Prev",
                    nextEl: ".HomeFooter_Next",
                }}
                direction="horizontal"
                mousewheel={{ forceToAxis: true }}
                spaceBetween={48}
                slidesPerView={1}
                slidesPerGroup={1}
                breakpoints={{
                    567: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                    },
                    1100: {
                        slidesPerView: 4,
                        slidesPerGroup: 4,
                    },
                }}
            >
                <SwiperSlide>
                    <SlideTitle>Set up your wallet</SlideTitle>

                    <SlideText>
                        To get started on World of V, set up your wallet of
                        choice:{" "}
                        <a
                            href="https://sync.vecha.in/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Sync2 (desktop)
                        </a>{" "}
                        or{" "}
                        <a
                            href="https://lite.sync.vecha.in/#/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Sync 2 Lite (mobile).
                        </a>{" "}
                        Connect your wallet and get ready to mint your NFTs!
                    </SlideText>
                </SwiperSlide>

                <SwiperSlide>
                    <SlideTitle>Create your profile</SlideTitle>

                    <SlideText>
                        Once you connected your wallet, create a profile by
                        selecting a username and an email address.
                    </SlideText>
                </SwiperSlide>

                <SwiperSlide>
                    <SlideTitle>Mint your NFTs</SlideTitle>

                    <SlideText>
                        Upload your artworks (image, audio, video), customize
                        them with a title and get ready to mint. Don’t worry
                        about gas fees: we take care of them! Minting is easy
                        and free.
                    </SlideText>
                </SwiperSlide>

                <SwiperSlide>
                    <SlideTitle>List them for sale</SlideTitle>

                    <SlideText>
                        Now you’re ready to Sell your NFTs on World of V: you
                        can offer a fixed price or run an auction, and list your
                        artworks in VET or WoV Token with 0 gas fees.
                    </SlideText>
                </SwiperSlide>
            </Swiper>
        </Container>
    </Wrapper>
);

const Wrapper = styled.div`
    padding: 64px 0;
    background-color: ${neutrals[7]};

    margin: 64px auto 0;

    ${media.m`
        padding: 32px 0 24px;
    `}

    ${dark`
        background-color: ${neutrals[2]};
    `}
`;

const Container = styled.div`
    ${containerLarge};
    position: relative;
`;

const CarouselButtons = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 24px;

    > * {
        &:not(:first-child) {
            margin-left: 16px;
        }
    }

    button {
        border: none !important;
    }
`;

const SlideTitle = styled.div`
    ${bodyBold2};
    color: ${neutrals[2]};
    text-align: center;

    ${dark`
        color: ${neutrals[8]};
    `}
`;

const SlideText = styled.div`
    margin-top: 8px;
    color: ${neutrals[4]};
    text-align: center;
    font-size: 14px;

    a {
        font-weight: 700;
        color: ${blue};
        transition: color 0.2s;

        &:hover {
            color: ${darken(0.1, blue)};
        }
    }
`;

export default HomeFooter;
