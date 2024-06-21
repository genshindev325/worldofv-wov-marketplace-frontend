import { FaqCard } from "@/components/common/FaqCard";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";

const FAQs: { id: number; title: string; body: string }[] = [
    {
        id: 1,
        title: "How can I claim my NFT Voucher?",
        body: "Once you've collected 10 Loyalty NFTs, a claim button will appear in your dashboard. Click it to collect your voucher for a R200 discount on your next meal - our way of thanking you for your loyalty and support.",
    },
    {
        id: 2,
        title: "How can i redeem my NFT Voucher?",
        body: "The NFT Voucher worth R200 can be redeemed at any Scheckter's RAW restaurant for a meal and it must be used in a single transaction. To redeem it, show it to the staff at checkout and follow their instructions.",
    },
    {
        id: 3,
        title: "What is a Loyalty NFT?",
        body: "Loyalty NFTs are our new way to reward our amazing customers! A unique, collectible digital asset that you receive every time you make a purchase at Scheckter's RAW. Keep collecting Loyalty NFTs and unlock exclusive discounts and rewards.",
    },
];

export function Faqs() {
    return (
        <Flex flexDirection="column" columnGap={4}>
            <Text variant="bodyBold1" textAlign="center">
                FAQ
            </Text>
            {FAQs.map(({ id, title, body }) => (
                <FaqCard key={id} question={title} answer={body} />
            ))}
        </Flex>
    );
}
