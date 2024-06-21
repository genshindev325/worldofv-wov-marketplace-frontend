import useGraphQL from "@/hooks/useGraphQL";
import React from "react";
import AspectRatio from "react-aspect-ratio";
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    Droppable,
    DroppableProvided,
} from "react-beautiful-dnd";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";
import { HomeCollectionFragment } from "../../generated/graphql";
import ModalAdminCreateHomeCollection from "../../modals/ModalAdminCreateHomeCollection";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { onDragEndHandler } from "../../utils/dragAndDrop";
import CircleButton from "../CircleButton";
import { Button } from "../common/Button";
import Icon from "../Icon";
import UserAvatar from "../UserAvatar";

const { media, dark } = mixins;
const { colors, typography, breakpoints } = variables;
const { neutrals } = colors;

export default function AdminHomeCollections() {
    const { sdk } = useGraphQL();

    const { data, mutate } = useSWR("HOME_COLLECTIONS", () =>
        sdk.GetHomeCollections()
    );

    const [items, setItems] = React.useState<
        HomeCollectionFragment[] | undefined
    >();
    const [selectedItem, setSelectedItem] = React.useState<
        HomeCollectionFragment | undefined
    >();

    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        if (data) setItems(data.collections);
    }, [data]);

    React.useEffect(() => {
        if (!isOpen) setSelectedItem(undefined);
    }, [isOpen]);

    if (!data) return null;

    const onSubmit = async (values: HomeCollectionFragment) => {
        try {
            await sdk.UpsertHomeCollection(values);
            await mutate();
            setIsOpen(false);
            toast.success("Collection created successfully!");
        } catch (error: any) {
            const message = error?.response?.errors?.[0]?.message;
            const fallback = "An error occurred while creating the collection";
            toast.error(message || fallback);
        }
    };

    const onRemove = async (id: string) => {
        try {
            await sdk.DeleteHomeCollection({ id });
            await mutate();
            setIsOpen(false);
            toast.success("Collection removed successfully!");
        } catch (error: any) {
            const message = error?.response?.errors?.[0]?.message;
            const fallback = "An error occurred while removing the item";
            toast.error(message || fallback);
        }
    };

    const onEdit = async (id: string) => {
        setSelectedItem(items?.find((el) => el.id === id));
        setIsOpen(true);
    };

    const onDragEnd = async (result: any) => {
        try {
            const reordered = onDragEndHandler(items!, result);
            if (!reordered) return;

            setItems(reordered);

            const item = items!.find((i) => i.id === result.draggableId)!;
            await sdk.UpsertHomeCollection({
                ...item,
                position: result.destination.index + 1,
            });

            await mutate();
        } catch (error: any) {
            const message = error?.response?.errors?.[0]?.message;
            const fallback = "An error occurred while reordering the items";
            toast.error(message || fallback);
        }
    };

    return (
        <Container>
            <Head>
                <HeadTitle>Collections</HeadTitle>

                <Button small onClick={() => setIsOpen(true)}>
                    New Collection
                </Button>
            </Head>

            <DragDropContext {...{ onDragEnd }}>
                <Droppable droppableId="list">
                    {(provided: DroppableProvided) => (
                        <List
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {items?.map((collection, index) => (
                                <ListItem
                                    key={collection.id}
                                    {...{ collection, index }}
                                    onEdit={() => onEdit(collection.id)}
                                    onRemove={() => onRemove(collection.id)}
                                />
                            ))}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </DragDropContext>

            <ModalAdminCreateHomeCollection
                {...{
                    isOpen,
                    setIsOpen,
                    onSubmit,
                    defaultValues: selectedItem,
                }}
            />
        </Container>
    );
}

interface ListItemProps {
    collection: HomeCollectionFragment;
    index: number;
    onEdit: () => void;
    onRemove: () => void;
}

function ListItem({
    index,
    onRemove,
    onEdit,
    collection: {
        id,
        title,
        startsAt,
        bannerImageUrl,
        avatarImageUrl,
        avatarVerifiedLevel,
    },
}: ListItemProps) {
    return (
        <Draggable key={id} draggableId={id} index={index}>
            {(provided: DraggableProvided) => (
                <ItemContainer
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <ItemImage>
                        <AspectRatio ratio="16/9">
                            <img src={bannerImageUrl} alt="" />
                        </AspectRatio>
                    </ItemImage>

                    <ItemBody>
                        <ItemHeader>
                            {avatarImageUrl && (
                                <UserAvatar
                                    src={avatarImageUrl}
                                    verified={!!avatarVerifiedLevel}
                                    verifiedLevel={avatarVerifiedLevel as any}
                                    size={48}
                                    verifiedSize={16}
                                />
                            )}
                            <ItemTitle>{title}</ItemTitle>
                        </ItemHeader>

                        <DetailsValue>
                            {new Date(startsAt).toUTCString()}
                        </DetailsValue>

                        <ButtonGroup>
                            <CircleButton
                                small
                                outline
                                onClick={() => onEdit()}
                            >
                                <Icon icon="pencil" />
                            </CircleButton>

                            <CircleButton
                                small
                                outline
                                onClick={() => onRemove()}
                            >
                                <Icon icon="close" />
                            </CircleButton>
                        </ButtonGroup>
                    </ItemBody>
                </ItemContainer>
            )}
        </Draggable>
    );
}

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
    ${typography.h4};
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

const ItemContainer = styled.div`
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
    position: relative;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
`;

const ButtonGroup = styled.div`
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;

    > * + * {
        margin-left: 12px;
    }
`;

const ItemHeader = styled.div`
    display: flex;
    align-items: center;

    > * + * {
        margin-left: 8px;
    }
`;

const ItemTitle = styled.p`
    ${typography.body1}
`;

const DetailsValue = styled.div`
    color: ${neutrals[4]};
    overflow: hidden;
    text-overflow: ellipsis;
`;
