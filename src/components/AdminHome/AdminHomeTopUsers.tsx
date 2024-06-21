import useGraphQL from "@/hooks/useGraphQL";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";
import { TopUserKind } from "../../generated/graphql";
import ModalAdminAddHomeTopUser from "../../modals/ModalAdminAddHomeTopUser";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { UserData } from "../../types/UserData";
import { onDragEndHandler } from "../../utils/dragAndDrop";
import CircleButton from "../CircleButton";
import { Button } from "../common/Button";
import Icon from "../Icon";
import UserPreviewItem from "../UserPreviewItem";

const { dark } = mixins;
const {
    colors: { neutrals },
    typography: { h4, caption1 },
} = variables;

export interface AdminHomeTopUsersProps {
    kind: TopUserKind;
}

const AdminHomeTopUsers = ({ kind }: AdminHomeTopUsersProps) => {
    const { sdk } = useGraphQL();

    const { data, mutate } = useSWR([{ kind }, "TOP_USER"], (args) =>
        sdk.GetTopUsers(args)
    );

    const [items, setItems] = React.useState<any[] | undefined>();

    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        if (data) {
            const items = data.users.map((el) => ({
                ...el,
                artist: el.user ? new UserData(el.user) : null,
            }));
            setItems(items);
        }
    }, [data]);

    if (!data) return null;

    const onSubmit = async (values: any) => {
        try {
            await sdk.UpsertTopUser({
                kind,
                address: values.address,
                position: values.position,
            });

            await mutate();

            setIsOpen(false);
            toast.success("Item created successfully!");
        } catch (error: any) {
            toast.error(
                error?.response?.errors?.[0]?.message ||
                    "An error occurred while creating the item"
            );
        }
    };

    const onRemove = async (address: string) => {
        try {
            await sdk.DeleteTopUser({
                kind,
                address,
            });
            await mutate();
            setIsOpen(false);
            toast.success("Item removed successfully!");
        } catch (error: any) {
            toast.error(
                error?.response?.errors?.[0]?.message ||
                    "An error occurred while removing the item"
            );
        }
    };

    const onDragEnd = async (result: any) => {
        if (items?.length) {
            const reordered = onDragEndHandler(items, result);

            if (reordered) {
                setItems(reordered);

                try {
                    await sdk.UpsertTopUser({
                        kind,
                        address: result.draggableId,
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
                <HeadTitle>
                    {kind === TopUserKind.TopArtist
                        ? "Top Artists"
                        : "Top Collectors"}
                </HeadTitle>

                <Button small onClick={() => setIsOpen(true)}>
                    {kind === TopUserKind.TopArtist
                        ? "Add Top Artist"
                        : "Add Top Collector"}
                </Button>
            </Head>

            <DragDropContext {...{ onDragEnd }}>
                <Droppable droppableId="list">
                    {(provided: any) => (
                        <List
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {items?.map(({ address, artist }, index) => (
                                <Draggable
                                    key={address}
                                    draggableId={address}
                                    index={index}
                                >
                                    {(provided: any) => (
                                        <Item
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {artist ? (
                                                <div>
                                                    <UserPreviewItem
                                                        label={address}
                                                        user={artist}
                                                    />
                                                </div>
                                            ) : (
                                                <FallbackContainer>
                                                    <FaExclamationTriangle
                                                        size={48}
                                                        color="red"
                                                    />
                                                    <FallbackText>
                                                        {address}
                                                    </FallbackText>
                                                </FallbackContainer>
                                            )}

                                            <Actions>
                                                <CircleButton
                                                    small
                                                    outline
                                                    onClick={() =>
                                                        onRemove(address)
                                                    }
                                                >
                                                    <Icon icon="close" />
                                                </CircleButton>
                                            </Actions>
                                        </Item>
                                    )}
                                </Draggable>
                            ))}

                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </DragDropContext>

            <ModalAdminAddHomeTopUser
                {...{ kind, isOpen, setIsOpen, onSubmit }}
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
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    background: ${neutrals[8]};
    padding: 16px;
    margin: 2px 0;

    ${dark`
        background: #18191d;
    `}

    div {
        padding: 0;
    }

    > :first-child {
        margin-right: 16px;
    }
`;

const Actions = styled.div`
    display: flex;

    div {
        width: 48px;
    }

    input {
        text-align: center;
    }
`;

const FallbackText = styled.p`
    ${caption1}
    color: ${neutrals[4]};
`;

const FallbackContainer = styled.div`
    display: flex;

    > * + * {
        margin-left: 16px;
    }
`;

export default AdminHomeTopUsers;
