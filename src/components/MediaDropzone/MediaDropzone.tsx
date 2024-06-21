import { darken } from "polished";
import { useMemo, useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import { FaEraser } from "react-icons/fa";
import styled from "styled-components";
import { BATCH_MINT_MAX_TOKEN_COUNT } from "../../constants/upload";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import getFormatsFromAccept from "../../utils/getFormatsFromAccept";
import CircleButton from "../CircleButton";
import { TokenAsset } from "../common/TokenAsset";

const { dark } = mixins;
const { colors, typography } = variables;
const { neutrals } = colors;

export interface MediaDropzoneProps {
    supportedMimeTypes: string[];
    maxFileCount: number;
    maxFileSizeBytes: number;
    files: File[];
    onDrop: (files: File[]) => void;
    onRemove: (file: File) => void;
    onClear: () => void;
}

export default function MediaDropzone({
    supportedMimeTypes,
    maxFileCount,
    maxFileSizeBytes,
    files,
    onDrop,
    onRemove,
    onClear,
}: MediaDropzoneProps) {
    const supportedFormats = useMemo(
        () => getFormatsFromAccept(supportedMimeTypes).join(", "),
        [supportedMimeTypes]
    );

    const accept = useMemo(
        () => supportedMimeTypes.reduce((vs, v) => ({ ...vs, [v]: [] }), {}),
        [supportedMimeTypes]
    );

    const maxFileSizeMiB = useMemo(
        () => maxFileSizeBytes / (1024 * 1024),
        [maxFileSizeBytes]
    );

    const [error, setError] = useState<string | null>(null);
    const [lastTimeout, setLastTimeout] = useState<NodeJS.Timeout | null>(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept,
        maxSize: maxFileSizeBytes,
        multiple: true,
        maxFiles: maxFileCount - files.length,
        onDropAccepted: onDrop,
        onDropRejected: (data) => {
            setError(data[0].errors[0].message);
            if (lastTimeout) clearTimeout(lastTimeout);
            const timeout = setTimeout(() => setLastTimeout(null), 1500);
            setLastTimeout(timeout);
        },
        validator: (file) => {
            if (files.length + 1 > maxFileCount) {
                return {
                    message: `Maximum file count is ${maxFileCount}`,
                    code: ErrorCode.TooManyFiles,
                };
            } else if (files.some((f) => f.name === file.name)) {
                return {
                    message: `File already exists`,
                    code: "file-already-present",
                };
            } else {
                return null;
            }
        },
    });

    return (
        <Container onDropCapture={(e) => e.preventDefault()}>
            <Dropzone {...getRootProps()}>
                <input {...getInputProps()} />
                {files.length ? (
                    files.map((file) => (
                        <FilePreview
                            key={file.name}
                            file={file}
                            deselectSelf={() => onRemove(file)}
                        />
                    ))
                ) : (
                    <DropzoneInfo>
                        <p>
                            Drag &amp; drop up to{" "}
                            <strong>{BATCH_MINT_MAX_TOKEN_COUNT}</strong> files
                            here or click to browse files from your computer.
                        </p>
                        <small>
                            Supported file types:{" "}
                            <strong>{supportedFormats}</strong>
                            <br />
                            Maximum file size: <strong>
                                {maxFileSizeMiB}
                            </strong>{" "}
                            MB
                        </small>
                    </DropzoneInfo>
                )}
                <ClearButton
                    isVisible={!!files.length}
                    small
                    title="Clear"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClear();
                    }}
                >
                    <FaEraser size={20} />
                </ClearButton>
            </Dropzone>
            <DropzoneError isOpen={!!lastTimeout}>{error}</DropzoneError>
        </Container>
    );
}

interface FilePreviewProps {
    file: File;
    deselectSelf: () => void;
}

function FilePreview({ file, deselectSelf }: FilePreviewProps) {
    const src = useMemo(() => URL.createObjectURL(file), [file]);

    return (
        <FilePreviewContainer onClick={(e) => e.stopPropagation()}>
            <DeselectButton onClick={deselectSelf} />
            <TokenAsset
                sizePx={128}
                asset={{ url: src, mimeType: file.type }}
            />
            <FilePreviewOverlay>{file.name}</FilePreviewOverlay>
        </FilePreviewContainer>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Dropzone = styled.div`
    position: relative;
    border: 1px solid ${neutrals[5]};
    min-height: 162px;
    background-color: ${neutrals[7]};
    border-radius: 8px;
    padding: 16px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;

    ${dark`
        background-color: ${neutrals[2]};
        border-color: ${neutrals[3]};
    `}
`;

const DropzoneInfo = styled.div`
    ${typography.body2}
    color: ${neutrals[4]};
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 8px;

    small {
        ${typography.caption2}
    }
`;

const DropzoneError = styled.div<{ isOpen?: boolean }>`
    ${typography.caption1}
    color: ${colors.red};
    overflow: hidden;
    max-height: ${(props) => (props.isOpen ? "24px" : "0px")};
    transition: max-height 200ms ease-in-out;
`;

const ButtonBase = styled(CircleButton)`
    background-color: ${colors.red};
    box-shadow: 0 0 8px 1px ${neutrals[3]};

    :hover {
        background-color: ${darken(0.1, colors.red)};
    }

    :active {
        background-color: ${darken(0.2, colors.red)};
    }

    ${dark`
        box-shadow: 0 0 8px 1px ${neutrals[1]};
    `}
`;

const DeselectButton = styled(ButtonBase)`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;

    ::before {
        content: "×";
        font-size: 24px;
        color: ${colors.neutrals[8]};
    }
`;

const ClearButton = styled(ButtonBase)<{ isVisible?: boolean }>`
    position: absolute;
    bottom: 8px;
    right: 8px;
    opacity: ${(props) => (props.isVisible ? "1" : "0")};
    transition: opacity 200ms ease-in-out;
`;

const FilePreviewContainer = styled.div`
    position: relative;
    border-radius: 8px;
    box-shadow: 0 0 8px 4px ${neutrals[5]};

    ${dark`
        box-shadow: 0 0 8px 2px ${neutrals[0]};
    `}
`;

const FilePreviewOverlay = styled.div`
    ${typography.caption1}
    position: absolute;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 4px;
    color: white;
    text-shadow: 0.1em 0 black, 0 0.1em black, -0.1em 0 black, 0 -0.1em black;
`;
