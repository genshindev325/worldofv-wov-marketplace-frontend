import moment from "moment";
import React from "react";
import ReactCountdown, { CountdownRenderProps } from "react-countdown";
import styled from "styled-components";
import { HomeCollectionFragment } from "../generated/graphql";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { Tooltip } from "./common/Tooltip";
import Link from "./Link";
import UserAvatar from "./UserAvatar";

const { dark } = mixins;
const {
    colors: { neutrals },
    typography: { bodyBold2 },
} = variables;

const DropCollectionCard: React.FC<HomeCollectionFragment> = ({
    title,
    startsAt,
    bannerLinkUrl,
    avatarLinkUrl,
    bannerImageUrl,
    avatarName,
    avatarImageUrl,
    avatarVerifiedLevel,
}) => {
    const isLive = new Date(startsAt) <= new Date();

    return (
        <Link href={bannerLinkUrl} passHref>
            <Container className="drop-card">
                <CardPreview>
                    <CardAsset>
                        <img src={bannerImageUrl} alt={avatarName || ""} />

                        {isLive && <LiveBanner>Live</LiveBanner>}
                    </CardAsset>

                    <Link href={avatarLinkUrl || undefined} passHref>
                        <a>
                            {!!avatarImageUrl && (
                                <Tooltip
                                    disabled={!avatarName}
                                    content={avatarName}
                                >
                                    <Avatar
                                        src={avatarImageUrl}
                                        verified={!!avatarVerifiedLevel}
                                        verifiedLevel={
                                            avatarVerifiedLevel as any
                                        }
                                    />
                                </Tooltip>
                            )}
                        </a>
                    </Link>
                </CardPreview>

                <CardLink>
                    <CardBody>
                        <CardLine>
                            <CardTitle>{title}</CardTitle>
                        </CardLine>

                        <CardLine>
                            <CardItems>
                                {isLive ? (
                                    <strong>NOW LIVE 🔺</strong>
                                ) : (
                                    <>
                                        <p>{moment(startsAt).format("LLL")}</p>

                                        <ReactCountdown
                                            date={startsAt}
                                            renderer={countdownRender}
                                        />
                                    </>
                                )}
                            </CardItems>
                        </CardLine>
                    </CardBody>
                </CardLink>
            </Container>
        </Link>
    );
};

const countdownRender = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
}: CountdownRenderProps) =>
    completed ? null : (
        <Countdown>
            {days ? (
                <CountdownValue>
                    <CountdownNumber>{days}</CountdownNumber>d
                </CountdownValue>
            ) : null}

            <CountdownValue>
                <CountdownNumber>{hours}</CountdownNumber>h
            </CountdownValue>

            <CountdownValue>
                <CountdownNumber>
                    {minutes.toString().padStart(2, "0")}
                </CountdownNumber>
                m
            </CountdownValue>

            <CountdownValue>
                <CountdownNumber>
                    {seconds.toString().padStart(2, "0")}
                </CountdownNumber>
                s
            </CountdownValue>
        </Countdown>
    );

const CardPreview = styled.div`
    position: relative;
`;

const CardAsset = styled.div`
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    overflow: hidden;
    height: 200px;
    -webkit-mask-image: -webkit-radial-gradient(white, black) !important;

    img,
    video {
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: transform 1s;
        background-color: ${neutrals[6]};

        ${dark`
            background-color: ${neutrals[3]};
        `}
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    border-radius: 16px;
    cursor: pointer;
    background: ${neutrals[8]};
    box-shadow: 0px 4px 24px -6px rgba(15, 15, 15, 0.12);

    &:hover {
        ${CardAsset} {
            img,
            video {
                transform: scale(1.1);
            }
        }
    }

    ${dark`
        background: ${neutrals[2]};
    `}
`;

const Avatar = styled(UserAvatar).attrs(() => ({
    size: 44,
    verifiedSize: 20,
}))`
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: -17px;
    border: 2px solid ${neutrals[8]};
    border-radius: 50%;

    ${dark`
        border-color: ${neutrals[2]};
        background: ${neutrals[2]};
    `}
`;

const CardLink = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 25px 12px 16px;
    color: ${neutrals[2]};

    ${dark`
        color: ${neutrals[8]};
    `}
`;

const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const CardLine = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;

    &:first-child {
        margin-bottom: 2px;
    }
`;

const CardTitle = styled.div`
    margin-right: auto;
    padding-top: 1px;
    ${bodyBold2}
    font-size: 18px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    width: 100%;
`;

const CardItems = styled.div`
    margin-right: auto;
    padding-top: 1px;
    font-size: 15px;
    line-height: 1;
    color: ${neutrals[4]};
    text-align: center;
    width: 100%;
    height: 100%;
    min-height: 43px;
`;

const LiveBanner = styled.div`
    position: absolute;
    top: 11px;
    left: 8px;
    background: #e4423c;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 26px;
    font-weight: 700;
    text-transform: uppercase;
    color: ${neutrals[8]};
    display: flex;
    align-items: center;

    &::before {
        content: "";
        display: inline-block;
        height: 6px;
        width: 6px;
        margin-right: 6px;
        border-radius: 100%;
        background: ${neutrals[8]};
    }
`;

const Countdown = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
`;

const CountdownValue = styled.div`
    display: flex;
    align-items: flex-end;
    font-weight: 500;
    letter-spacing: 1px;
    margin-left: 5px;

    &:first-child {
        margin-left: 0;
    }
`;

const CountdownNumber = styled.div`
    font-weight: 600;
    color: ${neutrals[3]};

    ${dark`
        color: ${neutrals[8]};
    `}
`;

export default DropCollectionCard;
