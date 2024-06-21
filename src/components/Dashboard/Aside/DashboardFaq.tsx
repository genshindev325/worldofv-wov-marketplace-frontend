import { FaqCard } from "@/components/common/FaqCard";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import React from "react";

const DashboardFaq: React.FC = () => {
    return (
        <Flex flexDirection="column" columnGap={3}>
            <Text variant="bodyBold1" textAlign="center" as="h3">
                FAQ
            </Text>
            <FaqCard
                question="What is the Genesis Collection?"
                answer="Genesis is the World of V signature collection of 10,000
                    cards celebrating the VeFam community. Each card generates
                    10 WoV tokens per day. After acquiring a card, stake it to
                    start collecting rewards right away."
            />
            <FaqCard
                question="What can I use Genesis Cards for?"
                answer="In addition to providing passive rewards for holders and enter staking pools, Genesis Cards can be used to complete mini-sets and unlock Genesis Special Cards that can boost your WoV daily generation  in addition to generating rewards for holders and granting access to staking pools."
            />
            <FaqCard
                question="What are Special Cards?"
                answer="Special Cards are special NFTs that provide an increased
                    daily WoV generation. Each cards features a different
                    generation, and can be unlocked by completing a specific
                    Genesis miniset."
            />
            <FaqCard
                question='What does "claimed" and "unclaimed"
                        mean?'
                answer='In order to complete a Special mini-set you can only use
                        "unclaimed" Cards, namely cards that haven&apos;t
                        already been used by another collector for that specific
                        set.'
            />
        </Flex>
    );
};

export default DashboardFaq;
