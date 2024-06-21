import { useUserData } from "@/hooks/useUserData";
import ModalBatchClaim from "@/modals/ModalBatchClaim";
import { useCollection } from "@/providers/CollectionProvider";
import formatPrice from "@/utils/formatPrice";
import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import ActionCard from "../ActionCard";
import { Alert } from "../common/Alert";
import { Box } from "../common/Box";
import { Button } from "../common/Button";
import { useConnex } from "../ConnexProvider";
import { dateOptions } from "../Dashboard/InfoTop/DashboardDelegation";

interface ClaimAllCardProps {
    isDelegated: boolean;
    delegationInfo?: Record<string, any>;
}

const ClaimAllCard: React.FC<ClaimAllCardProps> = ({
    isDelegated,
    delegationInfo,
}) => {
    const { collection } = useCollection();
    const { user } = useUserData();
    const { getUserStakingInfo } = useConnex();
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchEarnedWei = useCallback(
        async (contractAddresses: string[], userAddress: string) => {
            const stakingInfo = await Promise.all(
                contractAddresses.map((address) =>
                    getUserStakingInfo(address, userAddress)
                )
            );
            return stakingInfo.reduce(
                (earned, info) => earned.plus(info.earned),
                new BigNumber(0)
            );
        },
        [getUserStakingInfo]
    );

    const { data: earnedWei } = useSWR(
        [collection.stakingContractAddresses!, user!.address, "STAKING_EARNED"],
        fetchEarnedWei,
        { refreshInterval: 10000 }
    );

    const earnedWoV = useMemo(() => formatPrice(earnedWei), [earnedWei]);

    if (isDelegated && ["Genesis Special", "Genesis"].includes(collection.name))
        return (
            <Alert
                variant="info"
                title="$WoV delegation is active"
                text={`Delegation ends on ${new Date(
                    delegationInfo?.distributionEndTime * 1000
                ).toLocaleDateString(undefined, dateOptions)}`}
                style={{ marginTop: 16 }}
            />
        );

    return (
        <ActionCard
            description={
                <>
                    Total WoV earned: <strong>{earnedWoV ?? "---"}</strong>
                </>
            }
        >
            <ModalBatchClaim
                isOpen={isModalOpen}
                setIsOpen={setModalOpen}
                collectionId={collection.collectionId}
            />
            <Box>
                <Button
                    small
                    onClick={() => setModalOpen(true)}
                    loader={!earnedWei}
                    disabled={earnedWei?.eq(0)}
                    fullWidth
                >
                    Claim All
                </Button>
            </Box>
        </ActionCard>
    );
};

export default ClaimAllCard;
