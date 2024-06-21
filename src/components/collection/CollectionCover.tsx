import useGraphQL from "@/hooks/useGraphQL";
import { useUserData } from "@/hooks/useUserData";
import Link from "next/link";
import { useCollection } from "../../providers/CollectionProvider";
import { isSameAddress } from "../../utils/isSameAddress";
import { Button } from "../common/Button";
import { CoverUpload } from "../common/CoverUpload";
import Icon from "../Icon";

export const CollectionCover = () => {
    const { user } = useUserData();
    const { collection } = useCollection();
    const { sdk } = useGraphQL();

    // Errors thrown here will be handled within the <CoverUpload /> component
    const handleUpload = async (file: any) => {
        if (collection?.collectionId == null) return;

        const res = await sdk.UpsertCollection({
            collectionId: collection.collectionId,
            bannerImage: file,
        });

        if (!res?.collection?.collectionId)
            throw new Error("ColletionId not present");
    };

    return (
        <CoverUpload
            cover={collection?.bannerImageUrl}
            canEdit={
                !!user &&
                isSameAddress(user?.address, collection.creator?.address)
            }
            onUpload={handleUpload}
        >
            <Link href={`/collection/edit/${collection.collectionId}`} passHref>
                <Button small>
                    <span>Edit collection</span>
                    <Icon icon="edit" />
                </Button>
            </Link>
        </CoverUpload>
    );
};
