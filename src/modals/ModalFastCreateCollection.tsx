import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import { Button } from "../components/common/Button";
import Form from "../components/FormInputs/Form";
import { Input } from "../components/FormInputs/Input";
import SwitchField from "../components/FormInputs/SwitchField";
import AnimatedModal from "./AnimatedModal";

interface ModalFastCreateCollectionProps {
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void;
    onCollectionCreate: (values: FormData) => void;
}

type FormData = {
    name: string;
    private?: boolean;
};

const validationSchema = yup.object().shape({
    name: yup
        .string()
        .required()
        .transform((value) => value.replace(/^\s+|\s+$|\s+(?=\s)/g, "")),
    private: yup.boolean(),
});

const ModalFastCreateCollection: React.FC<ModalFastCreateCollectionProps> = ({
    isOpen,
    setIsOpen,
    onCollectionCreate: onSubmit,
}) => (
    <AnimatedModal
        small
        title="Create Collection"
        info="You will be able to edit the collection later"
        {...{ isOpen, setIsOpen }}
    >
        <Form<FormData>
            resetOnSubmit
            {...{ onSubmit, validationSchema }}
            render={({ formState: { isValid, isSubmitting } }) => (
                <FormContent>
                    <Input
                        label="Collection name"
                        inputProps={{
                            name: "name",
                            placeholder: "Enter the collection name",
                        }}
                    />

                    <SwitchField
                        label="Private"
                        description="Enabling this option will make your collection private, therefore it will not be searchable through the search bar and will not appear in the marketplace or in your profile."
                        inputProps={{
                            name: "private",
                            defaultChecked: false,
                        }}
                    />

                    <Button
                        type="submit"
                        loader={isSubmitting}
                        disabled={!isValid || isSubmitting}
                    >
                        Create
                    </Button>
                </FormContent>
            )}
        />
    </AnimatedModal>
);

const FormContent = styled.div`
    > :not(:last-child) {
        margin-bottom: 32px;
    }

    ${Button} {
        width: 100%;
    }
`;

export default ModalFastCreateCollection;
