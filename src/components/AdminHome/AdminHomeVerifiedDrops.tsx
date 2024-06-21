import useGraphQL from "@/hooks/useGraphQL";
import moment from "moment";
import React from "react";
import AspectRatio from "react-aspect-ratio";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";
import ModalAdminCreateVerifiedDrop, {
    AdminCreateVerifiedDropFormData,
} from "../../modals/ModalAdminCreateVerifiedDrop";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { UserData } from "../../types/UserData";
import { onDragEndHandler } from "../../utils/dragAndDrop";
import CircleButton from "../CircleButton";
import { Button } from "../common/Button";
import Icon from "../Icon";
import UserPreviewItem from "../UserPreviewItem";

const { media, dark } = mixins;
const {
    colors: { neutrals },
    typography: { h4, bodyBold2 },
} = variables;

const AdminHomeVerifiedDrops = () => {
    const { sdk } = useGraphQL();

    const { data, mutate } = useSWR("VERIFIED_DROPS", () =>
        sdk.GetVerifiedDrops()
    );

    const [items, setItems] = React.useState<any[] | undefined>();
    const [selectedItem, setSelectedItem] = React.useState<any | undefined>();

    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        if (data) {
            const arr = data.drops.map(
                ({
                    id,
                    address,
                    dateTime,
                    title,
                    imageUrl,
                    collection,
                    token,
                    artist,
                    asset,
                }) => {
                    const artistSlug = artist?.customUrl || artist?.address;
                    const name = title || token?.name || collection?.name;
                    const isLive = new Date(dateTime) <= new Date();
                    const creator = artist ? new UserData(artist) : null;

                    const href = collection
                        ? `/collection/${collection.collectionId}`
                        : token
                        ? `/token/${token.smartContractAddress}/${token.tokenId}`
                        : artistSlug
                        ? `/profile/${artistSlug}`
                        : null;

                    const image =
                        asset?.url ||
                        collection?.thumbnailImageUrl ||
                        collection?.bannerImageUrl ||
                        imageUrl!;

                    return {
                        id,
                        dateTime,
                        title,
                        address,
                        name,
                        isLive,
                        href,
                        image,
                        creator,
                    };
                }
            );

            setItems(arr);
        }
    }, [data]);

    React.useEffect(() => {
        if (!isOpen) {
            setSelectedItem(undefined);
        }
    }, [isOpen]);

    if (!data) return null;

    const onSubmit = async (values: AdminCreateVerifiedDropFormData) => {
        try {
            await sdk.UpsertVerifiedDrop({
                id: selectedItem?.id,
                position: values.position,
                dateTime: values.dateTime.toISOString(),
                imageUrl: values.imageUrl || null,
                title: values.title || null,
                address: values.address || null,
                collectionId: values.collectionId || null,
                tokenId: values.tokenId || null,
            });

            await mutate();

            setIsOpen(false);
            toast.success("Drop created successfully!");
        } catch (error: any) {
            toast.error(
                error?.response?.errors?.[0]?.message ||
                    "An error occurred while creating the drop"
            );
        }
    };

    const onRemove = async (id: string) => {
        try {
            await sdk.DeleteVerifiedDrop({ id });
            await mutate();
            setIsOpen(false);
            toast.success("Drop removed successfully!");
        } catch (error: any) {
            toast.error(
                error?.response?.errors?.[0]?.message ||
                    "An error occurred while removing the drop"
            );
        }
    };

    const onEdit = async (id: string) => {
        if (data) {
            setSelectedItem(data.drops.find((el) => el.id === id));
            setIsOpen(true);
        }
    };

    const onDragEnd = async (result: any) => {
        if (items?.length) {
            const reordered = onDragEndHandler(items, result);

            if (reordered) {
                setItems(reordered);

                try {
                    const item = data!.drops.find(
                        (i) => i.id === result.draggableId
                    )!;

                    await sdk.UpsertVerifiedDrop({
                        ...item,
                        position: result.destination.index + 1,
                    });

                    await mutate();
                } catch (error: any) {
                    toast.error(
                        error?.response?.errors?.[0]?.message ||
                            "An error occurred while reordering the items"
                    );
                }
            }
        }
    };

    return (
        <Container>
            <Head>
                <HeadTitle>Verified Drops</HeadTitle>

                <Button small onClick={() => setIsOpen(true)}>
                    New Drop
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
                                    {
                                        id,
                                        dateTime,
                                        name,
                                        isLive,
                                        image,
                                        creator,
                                    },
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
                                                    <AspectRatio ratio="1">
                                                        <>
                                                            {image && (
                                                                <img
                                                                    src={image}
                                                                    alt=""
                                                                />
                                                            )}

                                                            {isLive && (
                                                                <LiveBanner>
                                                                    Live
                                                                </LiveBanner>
                                                            )}
                                                        </>
                                                    </AspectRatio>
                                                </ItemImage>

                                                <ItemInfo>
                                                    {creator ? (
                                                        <UserPreviewItem
                                                            user={creator}
                                                        />
                                                    ) : (
                                                        <div />
                                                    )}

                                                    <ItemInfoBottom>
                                                        {name && (
                                                            <Details>
                                                                <DetailsLabel>
                                                                    {name}
                                                                </DetailsLabel>

                                                                <DetailsValue>
                                                                    {moment(
                                                                        dateTime
                                                                    ).format(
                                                                        "LLL"
                                                                    )}
                                                                </DetailsValue>
                                                            </Details>
                                                        )}

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
                                                    </ItemInfoBottom>
                                                </ItemInfo>
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

            <ModalAdminCreateVerifiedDrop
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

    ${Button} {
        display: none;
        margin: auto 32px 20px auto;

        ${media.s`
            display: block;
        `}
    }

    ${media.s`
        flex-direction: column;
    `}

    ${dark`
        background: #18191d;
    `}
`;

const ItemImage = styled.div`
    position: relative;
    max-width: 192px;
    min-width: 192px;
    width: 100%;
    background: ${neutrals[2]};

    ${media.s`
        max-width: 100%;
        min-width: 100%;
    `}

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const ItemInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    padding: 20px 32px;
`;

const ItemInfoBottom = styled.div`
    display: flex;
    align-items: flex-end;

    > * {
        &:not(:last-child) {
            margin-right: 16px;
        }
    }
`;

const ButtonGroup = styled.div`
    margin-left: auto;
    display: flex;

    > * {
        &:not(:first-child) {
            margin-left: 12px;
        }
    }
`;

const Details = styled.div``;

const DetailsLabel = styled.div`
    ${bodyBold2};
`;

const DetailsValue = styled.div`
    color: ${neutrals[4]};
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
        border-radius: 100%;
        margin-right: 6px;
        background: ${neutrals[8]};
    }
`;

export default AdminHomeVerifiedDrops;
