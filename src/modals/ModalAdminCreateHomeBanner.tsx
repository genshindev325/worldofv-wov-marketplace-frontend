import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import { Button } from "../components/common/Button";
import Form from "../components/FormInputs/Form";
import { Input } from "../components/FormInputs/Input";
import { HomeBannerFragment } from "../generated/graphql";
import AnimatedModal from "./AnimatedModal";

interface ModalAdminCreateHomeBannerProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (values: AdminCreateHomeBannerFormData) => Promise<any>;
    selectedItem?: HomeBannerFragment;
}

export type AdminCreateHomeBannerFormData = {
    image: string;
    collectionId?: string;
    artist?: string;
    url?: string;
    position: number;
};

const validationSchema = yup.object().shape({
    image: yup.string().url().required(),
    collectionId: yup.string(),
    artist: yup.string(),
    url: yup.string().url(),
    position: yup.number().required().min(1),
});

const ModalAdminCreateHomeBanner: React.FC<ModalAdminCreateHomeBannerProps> = ({
    isOpen,
    setIsOpen,
    onSubmit,
    selectedItem,
}) => (
    <AnimatedModal
        small
        title={selectedItem ? "Edit Banner" : "Create Banner"}
        {...{ isOpen, setIsOpen }}
    >
        <Form<AdminCreateHomeBannerFormData>
            resetOnSubmit
            {...{ onSubmit, validationSchema }}
            render={({ formState: { isValid, isSubmitting } }) => (
                <>
                    <FormGroup>
                        <Input
                            label="Image URL"
                            inputProps={{
                                name: "image",
                                placeholder: "Insert the banner image URL",
                                defaultValue: selectedItem?.image,
                            }}
                        />

                        <Input
                            label="Collection"
                            inputProps={{
                                name: "collectionId",
                                placeholder: "e.g. 100100000000",
                                defaultValue:
                                    selectedItem?.collectionId || undefined,
                            }}
                        />
                        <Input
                            label="Artist"
                            inputProps={{
                                name: "artist",
                                placeholder: "e.g. 0xF362…",
                                defaultValue: selectedItem?.artist || undefined,
                            }}
                        />
                        <Input
                            label="URL"
                            inputProps={{
                                name: "url",
                                placeholder: "Enter the URL to redirect to",
                                defaultValue: selectedItem?.url || undefined,
                            }}
                        />

                        <Input
                            label="Position"
                            inputProps={{
                                type: "number",
                                name: "position",
                                placeholder: "1",
                                defaultValue: selectedItem?.position || 1,
                            }}
                        />
                    </FormGroup>

                    <Button
                        type="submit"
                        style={{ width: "100%" }}
                        loader={isSubmitting}
                        disabled={!isValid || isSubmitting}
                    >
                        {selectedItem ? "Edit" : "Create"}
                    </Button>
                </>
            )}
        />
    </AnimatedModal>
);

const FormGroup = styled.div`
    > * {
        margin-bottom: 16px;
    }
`;

export default ModalAdminCreateHomeBanner;
