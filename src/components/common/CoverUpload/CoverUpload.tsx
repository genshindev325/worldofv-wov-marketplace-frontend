import { rgba } from "polished";
import { FC, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";
import common from "../../../styles/_common";
import mixins from "../../../styles/_mixins";
import variables from "../../../styles/_variables";
import { Button } from "../../common/Button";
import CoverUploadForm from "../../CoverUploadForm";
import Icon from "../../Icon";
import { Spacer } from "../Spacer";

const { media, dark } = mixins;
const { container } = common;
const {
    colors: { neutrals },
} = variables;

interface CoverUploadProps {
    children?: ReactNode;
    cover: string | null | undefined;
    canEdit?: boolean;
    onUpload?: (values: any) => Promise<void>;
}

export const CoverUpload: FC<CoverUploadProps> = ({
    children,
    cover,
    canEdit = false,
    onUpload = () => {},
}) => {
    const [active, setActive] = useState(false);
    const [uploadedCover, setUploadedCover] = useState<string | undefined>(
        cover || undefined
    );

    useEffect(() => {
        setUploadedCover(cover || undefined);
    }, [cover]);

    const onSubmit = async (values: any) => {
        try {
            await onUpload(values.file);
            toast.success("Cover image updated successfully!");
            setActive(false);
        } catch (err) {
            if (values?.file?.size > 1000000) {
                toast.error("The cover you tried to upload is too big");
            } else {
                toast.error("An error occurred while updating the cover");
            }
        }
    };

    return (
        <Container coverImageSrc={uploadedCover} {...{ active }}>
            {canEdit && (
                <InnerContainer>
                    <CoverUploadForm
                        {...{ onSubmit, setUploadedCover, setActive }}
                    />

                    <EditOverlay>
                        <Button small onClick={() => setActive(true)}>
                            <span>Edit cover</span>
                            <Icon icon="image" />
                        </Button>

                        {children != null && (
                            <>
                                <Spacer size={3} />
                                {children}
                            </>
                        )}
                    </EditOverlay>
                </InnerContainer>
            )}
        </Container>
    );
};

const EditOverlay = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 32px;
    opacity: 0;
    visibility: hidden;
    background: ${rgba("#141416", 0.6)};
    transition: all 0.2s;

    ${Button} {
        .icon {
            width: 16px;
            height: 16px;
            font-size: 16px;
            color: ${neutrals[8]};
        }
    }

    ${media.t`
        justify-content: center;
        padding-bottom: 56px;
    `}
`;

const Container = styled.div<{ coverImageSrc?: string; active?: boolean }>`
    position: relative;
    display: flex;
    align-items: flex-end;
    height: 326px;
    padding: 32px 0;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: cover;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.muted};
    background-image: url("/img/wov__fallback-cover.jpeg");
    transition: all 0.2s;

    &:hover {
        ${EditOverlay} {
            opacity: 1;
            visibility: visible;
        }
    }

    ${({ coverImageSrc }) =>
        coverImageSrc &&
        css`
            background-image: url(${coverImageSrc});
        `}

    ${media.t`
        height: 200px;
        padding-bottom: 64px;
    `}

    ${media.m`
        height: 150px;
        padding-bottom: 56px;
    `}

    ${({ active }) =>
        active &&
        css`
            ${EditOverlay} {
                opacity: 0 !important;
                visibility: hidden !important;
            }

            .cover-upload {
                opacity: 1;
                visibility: visible;
            }
        `}
`;

const InnerContainer = styled.div`
    ${container};
`;
