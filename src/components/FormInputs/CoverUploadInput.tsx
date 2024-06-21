import React from "react";
import { DropEvent, DropzoneOptions, useDropzone } from "react-dropzone";
import { Controller } from "react-hook-form";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import Icon from "../Icon";
import { FormInputProps } from "./Form";

const { media } = mixins;
const {
    typography: { body2 },
} = variables;

interface CoverUploadInputProps extends FormInputProps {
    inputProps: DropzoneOptions & { name: string };
    setUploadedCover: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const CoverUploadInput: React.FC<CoverUploadInputProps> = ({
    inputProps,
    errors,
    control,
    setUploadedCover,
}) => {
    return (
        <Controller
            name={inputProps.name}
            control={control}
            render={({ field: { onChange } }) => (
                <DropzoneComponent
                    {...{ inputProps, errors, onChange, setUploadedCover }}
                />
            )}
        />
    );
};

const DropzoneComponent: React.FC<
    CoverUploadInputProps & { onChange: any }
> = ({ inputProps, errors, onChange, setUploadedCover }) => {
    const [selectedFiles, setSelectedFiles] = React.useState<
        File | File[] | undefined | null
    >(null);

    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length) {
                setSelectedFiles(
                    inputProps.multiple ? acceptedFiles : acceptedFiles[0]
                );
            } else {
                setSelectedFiles(undefined);
            }
        },
        [inputProps.multiple]
    );

    const handleInputChange = React.useCallback(
        (event: DropEvent) => {
            const e = event as Event & { target: HTMLInputElement };
            const fileList = e.target.files;

            const files = fileList?.length ? Array.from(fileList) : [];

            if (files.length) {
                setSelectedFiles(inputProps.multiple ? files : files[0]);
            } else {
                setSelectedFiles(undefined);
            }
        },
        [inputProps.multiple]
    );

    React.useEffect(() => {
        if (selectedFiles !== null) {
            onChange(selectedFiles);

            if (!inputProps.multiple) {
                setUploadedCover(URL.createObjectURL(selectedFiles as File));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        ...inputProps,
    });

    return (
        <Container {...getRootProps()}>
            <input
                type="file"
                {...getInputProps({ onChange: handleInputChange })}
            />

            <InnerContainer>
                <Icon icon="upload-file" size={48} />

                {isDragActive ? (
                    <Title>Drag here to upload the cover</Title>
                ) : (
                    <>
                        <Title>Drag and drop your cover here</Title>
                        <Description>
                            or click to browse <br />
                            (1920x326px) 1 MB MAX
                        </Description>
                    </>
                )}
            </InnerContainer>
        </Container>
    );
};

const Container = styled.div`
    height: 100%;
    width: 100%;
`;

const InnerContainer = styled.div`
    position: relative;
    z-index: 2;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    ${media.m`
        justify-content: flex-start;
        padding-top: 40px;
    `}
`;

const Title = styled.div`
    font-size: 24px;
    line-height: ${32 / 24};
    font-weight: 600;

    ${media.m`
        font-size: 16px;
    `}
`;

const Description = styled.div`
    ${body2};

    ${media.m`
        font-size: 12px;
    `}
`;

export default CoverUploadInput;
