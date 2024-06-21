import moment from "moment";
import React from "react";
import styled from "styled-components";
import Web3 from "web3";
import * as yup from "yup";
import { Button } from "../components/common/Button";
import Form from "../components/FormInputs/Form";
import { Input } from "../components/FormInputs/Input";
import PillsNav, { NavItemProps } from "../components/PillsNav";
import { VerifiedDropFragment } from "../generated/graphql";
import AnimatedModal from "./AnimatedModal";

interface ModalAdminCreateVerifiedDropProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (values: AdminCreateVerifiedDropFormData) => Promise<any>;
    selectedItem?: VerifiedDropFragment;
}

export type AdminCreateVerifiedDropFormData = {
    dateTime: Date;
    position: number;
    title?: string | null;
    imageUrl?: string | null;
    address?: string | null;
    collectionId?: string | null;
    tokenId?: string | null;
};

const validationSchema = yup.object().shape({
    collectionId: yup.string(),
    tokenId: yup.string(),
    dateTime: yup.date().required(),
    position: yup.number().required().min(1),
    title: yup.string(),
    imageUrl: yup.string().url(),
    address: yup
        .string()
        .test(
            "isValidAddress",
            "Given address is not a valid VeChain address.",
            (value) => (value ? Web3.utils.isAddress(value) : true)
        ),
});

const ModalAdminCreateVerifiedDrop: React.FC<
    ModalAdminCreateVerifiedDropProps
> = ({ isOpen, setIsOpen, onSubmit, selectedItem }) => {
    const [selectedTab, setSelectedTab] = React.useState(
        selectedItem?.tokenId || selectedItem?.collectionId
            ? "Managed"
            : "Custom"
    );

    const navList = React.useMemo(
        () => [{ label: "Managed" }, { label: "Custom" }],
        []
    );

    const onTabChange = (item: NavItemProps) => setSelectedTab(item.label);

    const handleSubmit = (vs: AdminCreateVerifiedDropFormData) => {
        return onSubmit({
            position: vs.position,
            dateTime: vs.dateTime,
            title: selectedTab === "Custom" ? vs.title : null,
            imageUrl: selectedTab === "Custom" ? vs.imageUrl : null,
            address: selectedTab === "Custom" ? vs.address : null,
            collectionId: selectedTab === "Managed" ? vs.collectionId : null,
            tokenId: selectedTab === "Managed" ? vs.tokenId : null,
        });
    };

    React.useEffect(() => {
        setSelectedTab(
            selectedItem?.tokenId || selectedItem?.collectionId
                ? "Managed"
                : "Custom"
        );
    }, [selectedItem]);

    return (
        <AnimatedModal
            small
            title={selectedItem ? "Edit Drop" : "Create Drop"}
            {...{ isOpen, setIsOpen }}
        >
            <Form<AdminCreateVerifiedDropFormData>
                resetOnSubmit
                {...{ onSubmit: handleSubmit, validationSchema }}
                render={({ formState: { isValid, isSubmitting } }) => (
                    <>
                        <PillsNav
                            items={navList}
                            defaultSelected={selectedTab}
                            value={selectedTab}
                            onChange={onTabChange}
                        />

                        <FormGroup>
                            <div
                                style={{
                                    display:
                                        selectedTab === "Managed"
                                            ? "block"
                                            : "none",
                                }}
                            >
                                <Input
                                    label="Token"
                                    inputProps={{
                                        name: "tokenId",
                                        placeholder: "e.g. 100100100000",
                                        defaultValue:
                                            selectedItem?.tokenId || undefined,
                                    }}
                                />

                                <Input
                                    label="Collection"
                                    inputProps={{
                                        name: "collectionId",
                                        placeholder: "e.g. 100100000000",
                                        defaultValue:
                                            selectedItem?.collection
                                                ?.collectionId,
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    display:
                                        selectedTab === "Managed"
                                            ? "none"
                                            : "block",
                                }}
                            >
                                <Input
                                    label="Image URL"
                                    inputProps={{
                                        name: "imageUrl",
                                        placeholder: "https://ipfs.io/ipfs/…",
                                        defaultValue:
                                            selectedItem?.imageUrl || undefined,
                                    }}
                                />

                                <Input
                                    label="Title"
                                    inputProps={{
                                        name: "title",
                                        placeholder: "Drop Title",
                                        defaultValue:
                                            selectedItem?.title || undefined,
                                    }}
                                />

                                <Input
                                    label="Address"
                                    inputProps={{
                                        name: "address",
                                        placeholder: "e.g. 0xF362…",
                                        defaultValue:
                                            selectedItem?.address || undefined,
                                    }}
                                />
                            </div>

                            <Input
                                label="Date &amp; Time"
                                inputProps={{
                                    type: "datetime-local",
                                    name: "dateTime",
                                    placeholder: `Enter the drop date and time`,
                                    defaultValue: selectedItem?.dateTime
                                        ? moment(selectedItem?.dateTime).format(
                                              "YYYY-MM-DDTHH:mm"
                                          )
                                        : undefined,
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
};

const FormGroup = styled.div`
    margin-top: 16px;

    > * {
        &,
        > * {
            margin-bottom: 16px;
        }
    }
`;

export default ModalAdminCreateVerifiedDrop;
