import AspectRatio from "react-aspect-ratio";
import styled from "styled-components";
import BasePlaceholder from "../../common/BasePlaceholder/BasePlaceholder";

export const CardPlaceholder = () => {
    return (
        <Container className="card">
            <AspectRatio ratio="1">
                <Preview>
                    <BasePlaceholder width="100%" height="100%">
                        <rect x="0" y="0" width="100%" height="100%" />
                    </BasePlaceholder>

                    <Avatar>
                        <BasePlaceholder width="100%" height="100%">
                            <rect x="0" y="0" width="100%" height="100%" />
                        </BasePlaceholder>
                    </Avatar>
                </Preview>
            </AspectRatio>

            <Content>
                <Body>
                    <BasePlaceholder height={30} width="100%">
                        <rect x="0" rx="1" ry="1" width="80%" height="10" />
                        <rect
                            x="0"
                            y="20"
                            rx="1"
                            ry="1"
                            width="40%"
                            height="10"
                        />
                    </BasePlaceholder>
                </Body>

                <Footer>
                    <BasePlaceholder height={8} width="100%">
                        <rect
                            x="0"
                            y="0"
                            rx="1"
                            ry="1"
                            width="20%"
                            height="8"
                        />
                    </BasePlaceholder>
                </Footer>
            </Content>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: ${({ theme }) => theme.radii[4]}px;
    border: ${({ theme }) => `1px solid ${theme.colors.muted}`};
    background: ${({ theme }) => theme.colors.highlight};
    box-shadow: 0px 16px 32px rgba(31, 47, 69, 0.12);
`;

const Preview = styled.div`
    position: relative;
    border-radius: ${({ theme }) => theme.radii[4]}px;
`;

const Avatar = styled.div`
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.highlight};
    overflow: hidden;
    position: absolute;
    left: 12px;
    bottom: -17px;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 25px 12px 16px;
`;

const Body = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: 2px 0 12px;
`;

const Footer = styled.div`
    margin-top: 12px;
    padding: 9.5px 0 10px;
    border-top: ${({ theme }) => `1px solid ${theme.colors.background}`};
`;
