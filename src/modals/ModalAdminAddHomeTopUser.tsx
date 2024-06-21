import React from "react";
import styled from "styled-components";
import Web3 from "web3";
import * as yup from "yup";
import { Button } from "../components/common/Button";
import Form from "../components/FormInputs/Form";
import { Input } from "../components/FormInputs/Input";
import { TopUserKind } from "../generated/graphql";
import AnimatedModal from "./AnimatedModal";

interface ModalAdminAddHomeTopUserProps {
    kind: TopUserKind;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (values: FormData) => Promise<any>;
}

type FormData = {
    address: string;
    position: number;
};

const validationSchema = yup.object().shape({
    address: yup
        .string()
        .required()
        .test(
            "isValidAddress",
            "Given address is not a valid VeChain address.",
            (value) => (value ? Web3.utils.isAddress(value) : false)
        ),
    position: yup.number().required().min(1),
});

const ModalAdminAddHomeTopUser: React.FC<ModalAdminAddHomeTopUserProps> = ({
    kind,
    isOpen,
    setIsOpen,
    onSubmit,
}) => (
    <AnimatedModal
        small
        title={
            kind === TopUserKind.TopArtist
                ? "Add Top Artist"
                : "Add Top Collector"
        }
        {...{ isOpen, setIsOpen }}
    >
        <Form<FormData>
            resetOnSubmit
            {...{ onSubmit, validationSchema }}
            render={({ formState: { isValid, isSubmitting } }) => (
                <>
                    <FormGroup>
                        <Input
                            label="Address"
                            inputProps={{
                                name: "address",
                                placeholder: "e.g. 0xF362…",
                            }}
                        />

                        <Input
                            label="Position"
                            inputProps={{
                                type: "number",
                                name: "position",
                                placeholder: "1",
                                defaultValue: 1,
                            }}
                        />
                    </FormGroup>

                    <Button
                        type="submit"
                        style={{ width: "100%" }}
                        loader={isSubmitting}
                        disabled={!isValid || isSubmitting}
                    >
                        Create
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

export default ModalAdminAddHomeTopUser;
