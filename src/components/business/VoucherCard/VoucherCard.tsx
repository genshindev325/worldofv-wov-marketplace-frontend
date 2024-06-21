import { Card, CardProps } from "@/components/cards/CardV2";
import { Button } from "@/components/common/Button";
import { Flex } from "@/components/common/Flex";

export type VoucherCardProps = CardProps & {
    onClick: (token: any) => void;
};

export function VoucherCard({ onClick, ...cardProps }: VoucherCardProps) {
    return (
        <Flex flexDirection="column" columnGap={3}>
            <Card {...cardProps} />
            <Button onClick={onClick}>Use Voucher</Button>
        </Flex>
    );
}

// const StyledButton = styled.button`
//     all: unset;
//     cursor: pointer;

//     &:focus {
//         outline: orange 5px auto;
//     }
// `;
