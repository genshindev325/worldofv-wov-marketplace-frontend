import { Card, CardProps } from "@/components/cards/Card";
import { Box } from "@/components/common/Box";
import { Divider } from "@/components/common/Divider";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import Link from "@/components/Link";
import moment from "moment";
import React, { createElement } from "react";
import { useTheme } from "styled-components";

export type User = {
    dateTime?: string | null;
    user?: any; //TODO pass proper interface
};

export type EventsDisplayerProps = CardProps & {
    Icon: (props: any) => JSX.Element;
    title: string;
    users?: User[] | null;
};

export function EventsDisplayer({
    Icon,
    title,
    users,
    ...cardProps
}: EventsDisplayerProps) {
    const theme = useTheme();

    const iconProps = {
        size: 60,
        color: theme.colors.white,
    };

    const iconElement = createElement(Icon, iconProps);

    return (
        <Card {...cardProps}>
            <Flex flexDirection="column" columnGap={3}>
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="primary"
                    borderTopLeftRadius={4}
                    borderTopRightRadius={4}
                    rowGap={3}
                    p={2}
                >
                    {iconElement}
                    <Text variant="bodyBold1" color="white">
                        {title}
                    </Text>
                </Flex>
                <Box p={3}>
                    {users?.map((user, index) => (
                        <React.Fragment key={index}>
                            <Link
                                href={`/profile/${
                                    user.user?.customUrl ?? user.user?.address
                                }`}
                                passHref
                            >
                                <a>
                                    <Flex
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Text variant="bodyBold2" py={3}>
                                            {user.user?.name ??
                                                user.user?.address}
                                        </Text>
                                        <Text>
                                            {moment(user.dateTime).fromNow()}
                                        </Text>
                                    </Flex>
                                </a>
                            </Link>
                            {index < users.length && <Divider />}
                        </React.Fragment>
                    ))}
                    {!users && (
                        <Text variant="bodyBold2" textAlign="center">
                            No events so far
                        </Text>
                    )}
                </Box>
            </Flex>
        </Card>
    );
}
