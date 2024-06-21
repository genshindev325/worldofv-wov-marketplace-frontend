import useGraphQL from "@/hooks/useGraphQL";
import { userAddressSelector } from "@/store/selectors";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import variables from "../../styles/_variables";
import { Button } from "../common/Button";
import { Spacer } from "../common/Spacer";
import { useConnex } from "../ConnexProvider";
import FlatLoader from "../FlatLoader";
import { useRefresh } from "../RefreshContext";
import { BatchCreateContext } from "./BatchCreateContext";

const { colors, typography } = variables;
const { neutrals } = colors;

export default function BatchCreateSubmit() {
    const userAddress = useRecoilValue(userAddressSelector);
    const { collection, tokens, increaseStep } = useContext(BatchCreateContext);
    const { mintToken, checkTransaction } = useConnex();
    const refresh = useRefresh("profile-tab", "collection-tab");
    const router = useRouter();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const { sdk } = useGraphQL();

    const [currentOperation, setCurrentOperation] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [hasError, setHasError] = useState(false);

    const [ipfsHashes, setIpfsHashes] = useState<
        { fileHash: string; metadataHash: string }[]
    >([]);

    const uploadAllFiles = useCallback(async () => {
        const hashes: { fileHash: string; metadataHash: string }[] = [];

        for (const token of tokens) {
            const captchaToken = await executeRecaptcha!("pin_metadata");

            const { data } = await sdk.PinMetadataToArweave(
                {
                    image: token.file,
                    name: token.name!,
                    description: token.description,
                    categories: token.categories?.map((c) =>
                        c.value.toUpperCase()
                    ),
                    collectionName: collection?.label,
                },
                { "g-recaptcha-response": captchaToken }
            );

            hashes.push({
                fileHash: data.imageTxId,
                metadataHash: data.metadataTxId,
            });

            setUploadedCount((uploadedCount) => uploadedCount + 1);
        }

        setIpfsHashes(hashes);
    }, [collection?.label, executeRecaptcha, tokens]);

    const mintAllTokens = useCallback(async () => {
        const clauses = tokens.map((token, i) => ({
            metadataHash: ipfsHashes[i].metadataHash,
            fileHash: ipfsHashes[i].fileHash,
            editionsCount: 1,
            royalty: token.royaltyPercent,
            tokenName: token.name!,
            collectionName: collection?.label,
        }));

        const tx = await mintToken(...clauses);

        await checkTransaction({
            txID: tx.txid,
            txOrigin: tx.signer,
            eventName: "woviesCreation",
            clauseIndex: tx.clauseCount - 1,
            TIMEOUT: tx.clauseCount.length * 2000 + 30000,
            toast: {
                enabled: true,
                success: "All tokens have been minted!",
            },
        });

        await refresh();
    }, [
        checkTransaction,
        collection?.label,
        ipfsHashes,
        mintToken,
        refresh,
        tokens,
    ]);

    const operations = useMemo(() => {
        return [
            {
                label: `Upload files (${uploadedCount}/${tokens.length})`,
                handler: uploadAllFiles,
            },
            {
                label: "Wait for transaction confirmation",
                handler: mintAllTokens,
            },
            {
                label: "All done!",
                handler: async () => {},
            },
        ];
    }, [mintAllTokens, tokens.length, uploadAllFiles, uploadedCount]);

    useEffect(
        () => {
            if (currentOperation >= operations.length) {
                increaseStep();
                return;
            }

            operations[currentOperation]
                .handler()
                .then(() => setCurrentOperation(currentOperation + 1))
                .catch((e) => {
                    console.warn(e.message || e);
                    setHasError(true);
                });
        },
        [currentOperation] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return (
        <Container>
            <ListContainer>
                {operations.map((step, index) => (
                    <ItemContainer
                        key={index}
                        isActive={index <= currentOperation}
                    >
                        {hasError && index === currentOperation ? (
                            <FaExclamationTriangle
                                size={24}
                                color={colors.red}
                            />
                        ) : index === currentOperation ? (
                            <FlatLoader size={24} />
                        ) : index < currentOperation ? (
                            <FaCheck size={24} color={colors.green} />
                        ) : (
                            <Spacer size={4} />
                        )}
                        {step.label}
                    </ItemContainer>
                ))}
            </ListContainer>

            <Button
                loader={!hasError && currentOperation < operations.length}
                disabled={hasError}
                onClick={() => {
                    const path = `/profile/${userAddress}?tab=created`;
                    router.push(path);
                }}
            >
                Go to your profile
            </Button>
        </Container>
    );
}

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const ItemContainer = styled.div<{ isActive?: boolean }>`
    ${typography.body2}
    color: ${(props) => (props.isActive ? null : neutrals[4])};
    display: flex;
    gap: 16px;
`;
