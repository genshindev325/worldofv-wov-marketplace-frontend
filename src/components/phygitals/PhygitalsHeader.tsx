import { Card } from "@/components/cards/Card";
import { Flex } from "@/components/common/Flex";
import { Spacer } from "@/components/common/Spacer";
import { Text } from "@/components/common/Text";

const ITEMS: { id: number; title: string; body: string }[] = [
    {
        id: 0,
        title: "What is a Phygital?",
        body: "Phygital tech merges physical and digital worlds through IOT devices, creating a whole new experience for  collectors.",
    },
    {
        id: 1,
        title: "What do I receive when I buy a Phygital?",
        body: "When you make a purchase, you'll receive both the NFT and the physical item attached to it. This ensures that you can enjoy both the digital and tangible aspects of the artwork.",
    },
    {
        id: 2,
        title: "How can I receive it?",
        body: "To receive the physical piece, please contact the seller through email, and he will provide you with further instructions.",
    },
];

export function PhygitalsHeader() {
    return (
        <>
            <Flex alignItems="center" justifyContent="center" rowGap={3} mb={4}>
                <Text
                    variant="h3"
                    letterSpacing={3}
                    textAlign="center"
                    // ml={147}
                >
                    PHYGITAL NFTs
                </Text>
                {/* <Link href="#" passHref>
                    <Text as="a" color="primary">
                        View more FAQs <BsLink45Deg />
                    </Text>
                </Link> */}
            </Flex>
            <Flex
                alignItems="stretch"
                justifyContent="space-around"
                rowGap={4}
                px={3}
            >
                {ITEMS.map(({ id, title, body }) => (
                    <Card key={id} p={4} flex={1}>
                        <Text
                            variant="bodyBold2"
                            fontWeight="bold"
                            textAlign="center"
                        >
                            {title}
                        </Text>
                        <Spacer y size={2} />
                        <Text textAlign="center">{body}</Text>
                    </Card>
                ))}
            </Flex>
        </>
    );
}
