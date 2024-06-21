import { useMemo } from "react";
import { DropEvent, DropzoneOptions, useDropzone } from "react-dropzone";
import styled from "styled-components";
import { Box } from "../common/Box";
import Icon from "../Icon";

export interface CreateUploadFileProps
    extends Omit<
        DropzoneOptions,
        | "onDrop"
        | "onDropAccepted"
        | "onDropRejected"
        | "multiple"
        | "maxFiles"
        | "accept"
    > {
    accept?: string[];
    onChange?: (file: File, event: DropEvent) => void;
}

export default function CreateUploadFile({
    onChange,
    accept: supportedMimeTypes,
    ...dropzoneProps
}: CreateUploadFileProps) {
    const accept = useMemo(
        () => supportedMimeTypes?.reduce((vs, v) => ({ ...vs, [v]: [] }), {}),
        [supportedMimeTypes]
    );

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        ...dropzoneProps,
        accept,
        onDropAccepted: (files, event) => onChange?.(files[0], event),
    });

    const supportedFormats = useMemo(
        () =>
            supportedMimeTypes
                ?.map((v) => v.split("/")[1].toUpperCase())
                ?.join(", "),
        [supportedMimeTypes]
    );

    return (
        <Container>
            <Label>Upload file</Label>

            <Description>Drag or choose your file to upload</Description>

            <UploadFile {...getRootProps()}>
                {!!acceptedFiles.length && (
                    <FileOverlay file={acceptedFiles[0]} />
                )}

                <input {...getInputProps()} />

                <Icon icon="upload-file" />

                <InputDescription>
                    <strong>Drag &amp; drop</strong> file here to upload, or{" "}
                    <strong>click here</strong> to browse files from your
                    computer.
                </InputDescription>
            </UploadFile>

            <InfoContainer>
                {dropzoneProps?.maxSize && (
                    <Info>
                        Max Size{" "}
                        <strong>{dropzoneProps.maxSize / 1024 / 1024}MB</strong>
                    </Info>
                )}

                {supportedFormats?.length && (
                    <Info style={{ textAlign: "right" }}>
                        Accepted Formats <strong>{supportedFormats}</strong>
                    </Info>
                )}
            </InfoContainer>
        </Container>
    );
}

function FileOverlay({ file }: { file: File }) {
    const url = useMemo(() => URL.createObjectURL(file), [file]);

    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            zIndex={1}
            height="100%"
            width="100%"
        >
            <Preview
                style={{ objectFit: "cover" }}
                src={url}
                alt="image preview"
            />
        </Box>
    );
}

const Preview = styled.img`
    height: 100%;
    width: 100%;
    opacity: 0.2;
`;

const Container = styled.div`
    position: "relative";
    margin-bottom: 32px;
`;

const Label = styled.div`
    ${({ theme }) => theme.typography.bodyBold2};
`;

const Description = styled.div`
    margin-top: 4px;
    ${({ theme }) => theme.typography.caption2};
    color: ${({ theme }) => theme.colors.accent};
`;

const UploadFile = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 182px;
    margin-top: 16px;
    border-radius: 16px;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.muted};
    transition: all 0.2s;

    .icon {
        margin-bottom: 10px;
        width: 24px;
        height: 24px;
        font-size: 24px;
        color: ${({ theme }) => theme.colors.accent};
        transition: color 0.2s;
    }
`;

const InputDescription = styled.div`
    ${({ theme }) => theme.typography.caption2};
    color: ${({ theme }) => theme.colors.accent};
    max-width: 85%;
    text-align: center;
    transition: color 0.2s;

    @media only screen and (min-width: ${({ theme }) => theme.breakpoints.s}) {
        max-width: 50%;
    }
`;

const Info = styled.div`
    ${({ theme }) => theme.typography.caption2};
    color: ${({ theme }) => theme.colors.accent};
`;

const InfoContainer = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 4px;
`;
