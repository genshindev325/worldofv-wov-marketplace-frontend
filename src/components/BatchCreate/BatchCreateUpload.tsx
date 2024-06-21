import { useUserDataLegacy } from "@/hooks/useUserData";
import { useContext, useMemo } from "react";
import styled from "styled-components";
import {
    BATCH_MINT_MAX_FILE_SIZE_BYTES,
    BATCH_MINT_MAX_TOKEN_COUNT,
    SUPPORTED_MIME_TYPES,
} from "../../constants/upload";
import { Alert } from "../common/Alert";
import { Button } from "../common/Button";
import Link from "../Link";
import MediaDropzone from "../MediaDropzone";
import { BatchCreateContext } from "./BatchCreateContext";

export default function BatchCreateUpload() {
    const user = useUserDataLegacy();

    const { tokens, insertTokens, removeToken, replaceTokens, increaseStep } =
        useContext(BatchCreateContext);

    const files = useMemo(() => tokens.map((t) => t.file), [tokens]);

    const onDrop = (files: File[]) => {
        insertTokens(files.map((file) => ({ file })));
    };

    const onRemove = (file: File) => {
        removeToken(tokens.findIndex((t) => t.file.name === file.name));
    };

    const onClear = () => {
        replaceTokens([]);
    };

    if (!user) {
        return null;
    }

    return (
        <Container>
            <MediaDropzone
                supportedMimeTypes={SUPPORTED_MIME_TYPES}
                maxFileCount={BATCH_MINT_MAX_TOKEN_COUNT}
                maxFileSizeBytes={BATCH_MINT_MAX_FILE_SIZE_BYTES}
                files={files}
                onDrop={onDrop}
                onRemove={onRemove}
                onClear={onClear}
            />

            {!user.canMint && (
                <Alert
                    title={
                        user.blacklisted
                            ? "Your account has been banned"
                            : "Your profile is not complete"
                    }
                    text={
                        user.blacklisted ? (
                            "If your account has been mistakenly banned, please contact an administrator"
                        ) : (
                            <>
                                To be able to mint please{" "}
                                <Link href="/profile/edit" passHref>
                                    <a>update your profile</a>
                                </Link>{" "}
                                details
                            </>
                        )
                    }
                />
            )}

            <Button
                disabled={!tokens.length || !user.canMint}
                onClick={increaseStep}
            >
                Next
            </Button>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
`;
