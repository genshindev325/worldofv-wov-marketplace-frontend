import { userAddressSelector } from "@/store/selectors";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { UserOfferType } from "../../generated/graphql";
import { useQueryGetOffersForUser } from "../../hooks/useQueryGetOffersForUser";
import CircleButton from "../CircleButton";
import { Box } from "../common/Box";
import { Text } from "../common/Text";
import { Tooltip } from "../common/Tooltip";
import Icon from "../Icon";

export default function HeaderOffersButton() {
    const address = useRecoilValue(userAddressSelector);
    const [offersReceivedCount] = useQueryGetOffersForUser(
        address ?? "",
        UserOfferType.Received,
        { page: 0, perPage: 0 }
    );

    return (
        <Link href={`/profile/${address}?tab=offers-received`}>
            <a>
                <Tooltip
                    content="Check the offers received"
                    placement="bottom"
                    bg="silver"
                    borderColor="silver"
                    color="white"
                >
                    <CircleButton
                        small
                        outline
                        style={{ position: "relative" }}
                        ui
                        button
                    >
                        {!!offersReceivedCount?.meta?.total && (
                            <Box
                                position="absolute"
                                top={0}
                                left={24}
                                borderRadius={8}
                                backgroundColor="error"
                            >
                                <Text
                                    variant="captionBold2"
                                    padding={1}
                                    lineHeight="50%"
                                    color="white"
                                >
                                    {offersReceivedCount?.meta?.total}
                                </Text>
                            </Box>
                        )}
                        <Icon icon="notification" />
                    </CircleButton>
                </Tooltip>
            </a>
        </Link>
    );
}
