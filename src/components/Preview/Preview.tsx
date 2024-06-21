import { useUserData } from "@/hooks/useUserData";
import React from "react";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import Card from "../Card";
import { useCreate } from "../Create/CreateProvider";

const { media } = mixins;
const {
    colors: { neutrals },
    typography: { bodyBold2, caption2 },
} = variables;

interface PreviewProps {
    cardOnly?: boolean;
    description?: string;
}

const Preview: React.FC<PreviewProps> = ({ cardOnly, description = "" }) => {
    const { user } = useUserData();
    const { formValues } = useCreate();

    const previewImage = React.useMemo(
        () =>
            formValues?.file ? URL.createObjectURL(formValues.file) : undefined,
        [formValues?.file]
    );

    if (!user) {
        return null;
    }

    return (
        <Container>
            {!cardOnly && <Label>Preview</Label>}
            <Description>{description}</Description>

            <Card
                fileType={formValues?.file?.type || "image/*"}
                royalty={formValues?.royalty || 0}
                createdAtBlockTimestamp={0}
                assets={
                    previewImage
                        ? [
                              {
                                  url: previewImage,
                                  size: "ORIGINAL",
                                  mimeType: formValues?.file?.type || "image/*",
                              },
                          ]
                        : undefined
                }
                creator={user}
                name={formValues?.name || "Item name…"}
                collection={{
                    id: "",
                    collectionId: "",
                    name: formValues?.collection?.label || "",
                }}
                onSale={0}
                editionsCount={
                    formValues?.isMultipleEditions
                        ? Math.max(formValues.editionsCount || 0, 1)
                        : 1
                }
            />
        </Container>
    );
};

const Container = styled.div`
    position: sticky;
    top: 80px;
    padding-top: 40px;
    margin-top: -40px;
    flex-shrink: 0;
    width: 352px;

    ${media.d`
        width: 304px;
    `}
`;

const Label = styled.div`
    ${bodyBold2};
`;

const Description = styled.div`
    margin: 4px 0 16px;
    ${caption2};
    color: ${neutrals[4]};
`;

export default Preview;
