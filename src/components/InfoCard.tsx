import React from "react";
import AspectRatio from "react-aspect-ratio";
import styled from "styled-components";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import Icon from "./Icon";
import Link from "./Link";

const { dark } = mixins;
const {
    colors: { neutrals },
    typography: { bodyBold2, caption1 },
} = variables;

interface InfoCardProps {
    title: string;
    description: string;
    image?: string;
    link?: string;
    icon?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    description,
    image,
    link,
    icon,
}) => {
    return (
        <Link href={link} passHref>
            <Container style={link ? { cursor: "pointer" } : undefined}>
                {image ? (
                    <CardPreview>
                        <AspectRatio ratio="3">
                            <CardAsset>
                                <img src={image} alt="Card preview" />
                            </CardAsset>
                        </AspectRatio>
                    </CardPreview>
                ) : null}

                <CardBody>
                    {icon && <Icon icon={icon} />}
                    <Title>{title}</Title>
                    <Description>{description}</Description>
                </CardBody>
            </Container>
        </Link>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 16px;
    background: ${neutrals[8]};
    box-shadow: 0px 10px 16px rgba(31, 47, 69, 0.12);

    ${dark`
        background: ${neutrals[2]};
    `}
`;

const CardPreview = styled.div`
    position: relative;
`;

const CardAsset = styled.div`
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    overflow: hidden;
    -webkit-mask-image: -webkit-radial-gradient(white, black) !important;

    img,
    div {
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

const CardBody = styled.div`
    padding: 20px;

    .icon {
        color: ${neutrals[4]};
        font-size: 50px !important;
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 10px;
    }
`;

const Title = styled.h2`
    padding-top: 1px;
    ${bodyBold2}
    font-size: 18px;
    margin-bottom: 10px;
`;

const Description = styled.p`
    ${caption1}
    color: ${neutrals[4]};
`;

export default InfoCard;
