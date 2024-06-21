import useGraphQL from "@/hooks/useGraphQL";
import { useMediaQuery } from "@react-hook/media-query";
import React from "react";
import AspectRatio from "react-aspect-ratio";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";
import { HomeBannerFragment } from "../../generated/graphql";
import ModalAdminCreateHomeBanner, {
    AdminCreateHomeBannerFormData,
} from "../../modals/ModalAdminCreateHomeBanner";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { onDragEndHandler } from "../../utils/dragAndDrop";
import CircleButton from "../CircleButton";
import { Button } from "../common/Button";
import Icon from "../Icon";

const { media, dark } = mixins;
const {
    colors: { neutrals },
    typography: { h4, bodyBold2 },
    breakpoints,
} = variables;

const AdminHomeBanner = () => {
    const isSmallScreen = useMediaQuery(`(max-width: ${breakpoints.a})`);

    const { sdk } = useGraphQL();
    const { data, mutate } = useSWR("HOME_BANNERS", () => sdk.GetHomeBanners());

    const [items, setItems] = React.useState<
        HomeBannerFragment[] | undefined
    >();
    const [selectedItem, setSelectedItem] = React.useState<
        HomeBannerFragment | undefined
    >();

    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        if (data) setItems(data.banners);
    }, [data]);

    React.useEffect(() => {
        if (!isOpen) {
            setSelectedItem(undefined);
        }
    }, [isOpen]);

    if (!data) {
        return null;
    }

    const onSubmit = async (values: AdminCreateHomeBannerFormData) => {
        try {
            if (selectedItem) {
                await sdk.UpdateHomeBanner({ ...values, id: selectedItem.id });
            } else {
                await sdk.CreateHomeBanner(values);
            }

            await mutate();

            setIsOpen(false);
            toast.success("Banner created successfully!");
        } catch (error: any) {
            toast.error(
                error?.response?.errors?.[0]?.message ||
                    "An error occurred while creating the banner"
            );
        }
    };

    const onRemove = async (id: string) => {
        try {
            await sdk.DeleteHomeBanner({ id });
            await mutate();
            setIsOpen(false);
            toast.success("Banner removed successfully!");
        } catch (error: any) {
            toast.error(
                error?.response?.errors?.[0]?.message ||
                    "An error occurred while removing the banner"
            );
        }
    };

    const onEdit = async (id: string) => {
        setSelectedItem(items?.find((el) => el.id === id));
        setIsOpen(true);
    };

    const onDragEnd = async (result: any) => {
        try {
            const reordered = onDragEndHandler(items!, result);
            if (reordered) {
                setItems(reordered);

                const item = items!.find((i) => i.id === result.draggableId)!;

                await sdk.UpdateHomeBanner({
                    id: item.id,
                    position: result.destination.index + 1,
                });

                await mutate();
            }
        } catch (error: any) {
            toast.error(
                error?.response?.errors?.[0]?.message ||
                    "An error occurred while reordering the items"
            );
        }
    };

    return (
        <Container>
            <Head>
                <HeadTitle>Banner</HeadTitle>

                <Button small onClick={() => setIsOpen(true)}>
                    New Banner
                </Button>
            </Head>

            <DragDropContext {...{ onDragEnd }}>
                <Droppable droppableId="list">
                    {(provided: any) => (
                        <List
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {items?.map(
                                (
                                    { id, image, artist, collectionId, url },
                                    index
                                ) => (
                                    <Draggable
                                        key={id}
                                        draggableId={id}
                                        index={index}
                                    >
                                        {(provided: any) => (
                                            <Item
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <ItemImage>
                                                    <AspectRatio ratio="16/9">
                                                        <img
                                                            src={image}
                                                            alt=""
                                                        />
                                                    </AspectRatio>
                                                </ItemImage>

                                                <ItemBody>
                                                    <ItemInfo>
                                                        {!(
                                                            isSmallScreen &&
                                                            !artist
                                                        ) && (
                                                            <Details>
                                                                <DetailsLabel>
                                                                    Artist
                                                                </DetailsLabel>

                                                                <DetailsValue>
                                                                    {artist ||
                                                                        "Not set"}
                                                                </DetailsValue>
                                                            </Details>
                                                        )}

                                                        {!(
                                                            isSmallScreen &&
                                                            !collectionId
                                                        ) && (
                                                            <Details>
                                                                <DetailsLabel>
                                                                    Collection
                                                                </DetailsLabel>

                                                                <DetailsValue>
                                                                    {collectionId ||
                                                                        "Not set"}
                                                                </DetailsValue>
                                                            </Details>
                                                        )}

                                                        {!(
                                                            isSmallScreen &&
                                                            !url
                                                        ) && (
                                                            <Details>
                                                                <DetailsLabel>
                                                                    URL
                                                                </DetailsLabel>

                                                                <DetailsValue>
                                                                    {url ||
                                                                        "Not set"}
                                                                </DetailsValue>
                                                            </Details>
                                                        )}
                                                    </ItemInfo>

                                                    <ButtonGroup>
                                                        <CircleButton
                                                            small
                                                            outline
                                                            onClick={() =>
                                                                onEdit(id)
                                                            }
                                                        >
                                                            <Icon icon="pencil" />
                                                        </CircleButton>

                                                        <CircleButton
                                                            small
                                                            outline
                                                            onClick={() =>
                                                                onRemove(id)
                                                            }
                                                        >
                                                            <Icon icon="close" />
                                                        </CircleButton>
                                                    </ButtonGroup>
                                                </ItemBody>
                                            </Item>
                                        )}
                                    </Draggable>
                                )
                            )}

                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </DragDropContext>

            <ModalAdminCreateHomeBanner
                {...{ isOpen, setIsOpen, onSubmit, selectedItem }}
            />
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
`;

const Head = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32px;
    background: ${neutrals[8]};
    border-radius: 4px;

    ${dark`
        background: #18191d;
    `}
`;

const HeadTitle = styled.h4`
    ${h4};
`;

const List = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    background: ${neutrals[7]};
    padding: 2px 0;

    ${dark`
        background: ${neutrals[1]};
    `}
`;

const Item = styled.div`
    display: flex;
    flex-direction: row;
    border-radius: 4px;
    background: ${neutrals[8]};
    margin: 2px 0;
    flex: 1;

    ${media.a`
        flex-direction: column;
    `}

    ${dark`
        background: #18191d;
    `}
`;

const ItemImage = styled.div`
    position: relative;
    max-width: 256px;
    min-width: 256px;
    width: 100%;
    background: ${neutrals[2]};
    display: flex;
    align-items: center;

    ${media.a`
        max-width: 100%;
        min-width: 100%;
    `}

    > * {
        width: 100%;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const ItemBody = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 16px;
    flex: 1;

    ${media.a`
        padding: 20px 16px;
    `}
`;

const ItemInfo = styled.div`
    max-width: calc(100% - 40px - 16px - 40px - 16px);
`;

const ButtonGroup = styled.div`
    margin-top: auto;
    margin-left: auto;
    display: flex;

    > * {
        &:not(:first-child) {
            margin-left: 12px;
        }
    }
`;

const Details = styled.div`
    margin-bottom: 16px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const DetailsLabel = styled.div`
    ${bodyBold2};
`;

const DetailsValue = styled.div`
    color: ${neutrals[4]};
    overflow: hidden;
    text-overflow: ellipsis;
`;

export default AdminHomeBanner;
