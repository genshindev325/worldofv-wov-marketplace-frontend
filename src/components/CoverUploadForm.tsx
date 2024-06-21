import { rgba } from "polished";
import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { Button } from "./common/Button";
import CoverUploadInput from "./FormInputs/CoverUploadInput";
import Form from "./FormInputs/Form";

const { media } = mixins;
const {
    colors: { neutrals },
} = variables;

interface CoverUploadProps {
    onSubmit: (values: FormData) => Promise<any>;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
    setUploadedCover: React.Dispatch<React.SetStateAction<string | undefined>>;
}

type FormData = {};

const validationSchema = yup.object().shape({});

const CoverUploadForm: React.FC<CoverUploadProps> = ({
    setUploadedCover,
    setActive,
    onSubmit,
}) => (
    <Form<FormData>
        resetOnSubmit
        {...{ onSubmit, validationSchema }}
        render={({ reset }) => (
            <ProfileFile className="cover-upload">
                <CoverUploadInput
                    inputProps={{ name: "file" }}
                    {...{ setUploadedCover }}
                />

                <ButtonGroup>
                    <Button
                        small
                        onClick={() => {
                            reset();
                            setActive(false);
                            setUploadedCover(undefined);
                        }}
                    >
                        Cancel
                    </Button>

                    <Button small type="submit">
                        Save photo
                    </Button>
                </ButtonGroup>
            </ProfileFile>
        )}
    />
);

const ProfileFile = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    color: ${neutrals[8]};
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s;

    &::before,
    &::after {
        content: "";
        position: absolute;
    }

    &::before {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${rgba("#141416", 0.6)};
    }

    &::after {
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
        border: 2px dashed ${neutrals[6]};
        border-radius: ${({ theme }) => theme.radii[3]}px;
    }

    .icon {
        margin-bottom: 24px;
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: ${neutrals[8]};

        ${media.m`
            width: 24px;
            height: 24px;
            font-size: 24px;
            margin-bottom: 12px;
        `}
    }
`;

const ButtonGroup = styled.div`
    position: absolute;
    right: 32px;
    bottom: 32px;
    z-index: 4;

    display: flex;

    > * {
        &:not(:first-child) {
            margin-left: 16px;
        }
    }

    ${media.t`
        bottom: 48px;
    `}

    ${media.m`
        right: 50%;
        transform: translateX(50%);
    `}
`;

export default CoverUploadForm;
