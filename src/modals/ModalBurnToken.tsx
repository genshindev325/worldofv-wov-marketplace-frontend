import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import { Alert } from "../components/common/Alert";
import { Button } from "../components/common/Button";
import Form from "../components/FormInputs/Form";
import { Input } from "../components/FormInputs/Input";
import { useItem } from "../components/ProductDetail/ProductDetailProvider";
import AnimatedModal from "./AnimatedModal";

interface ModalBurnTokenProps {
    isOpen: boolean;
    isBurning: boolean;
    setIsOpen: (newState: boolean) => void;
    onBurn: () => void;
}

type FormData = {
    confirmation: string;
};

const validationSchema = yup.object().shape({
    confirmation: yup
        .string()
        .required()
        .test(
            "isValidConfirmation",
            'Please type "Confirm".',
            (value) => value?.toLowerCase() === "confirm"
        ),
});

const ModalBurnToken: React.FC<ModalBurnTokenProps> = ({
    isOpen,
    isBurning,
    setIsOpen,
    onBurn,
}) => {
    const { token, selectedEdition } = useItem();

    return (
        <AnimatedModal
            small
            title="Burn token"
            info={
                <>
                    Edition{" "}
                    <strong>&#35;{selectedEdition?.editionNumber}</strong> of{" "}
                    <strong>{token.name}</strong> will be burned
                </>
            }
            {...{ isOpen, setIsOpen }}
        >
            <Form<FormData>
                resetOnSubmit
                onSubmit={onBurn}
                {...{ onBurn, validationSchema }}
                render={({ formState: { isValid, isSubmitting } }) => (
                    <>
                        <FormGroup>
                            <Input
                                inputProps={{
                                    name: "confirmation",
                                    placeholder:
                                        'Please type "Confirm" to enable the burning',
                                }}
                            />
                        </FormGroup>
                        <Alert
                            title="Warning: this action cannot be undone"
                            text="Upon burning, your NFT will be destroyed forever."
                            style={{ marginTop: 32 }}
                        />

                        <Buttons>
                            <Button
                                type="submit"
                                disabled={!isValid}
                                loader={isSubmitting || isBurning}
                            >
                                Burn
                            </Button>
                        </Buttons>
                    </>
                )}
            />
        </AnimatedModal>
    );
};

const Buttons = styled.div`
    margin-top: 32px;

    ${Button} {
        width: 100%;
    }
`;

const FormGroup = styled.div`
    > * {
        margin-bottom: 16px;
    }
`;

export default ModalBurnToken;
