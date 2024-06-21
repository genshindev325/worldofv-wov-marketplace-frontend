import useGraphQL from "@/hooks/useGraphQL";
import { userAddressSelector } from "@/store/selectors";
import { useRecoilValue } from "recoil";
import { useProfile } from "../../providers/ProfileProvider";
import { isSameAddress } from "../../utils/isSameAddress";
import { CoverUpload } from "../common/CoverUpload";

export const ProfileCover = () => {
    const walletAddress = useRecoilValue(userAddressSelector);
    const { user } = useProfile();
    const { sdk } = useGraphQL();

    // Errors thrown here will be handled within the <CoverUpload /> component
    const handleUpload = async (bannerImage: any) => {
        if (user == null) return;
        await sdk.UpdateUser({ bannerImage });
    };

    return (
        <CoverUpload
            cover={user?.coverImage}
            canEdit={
                isSameAddress(user?.address, walletAddress) && !!user?.profileId
            }
            onUpload={handleUpload}
        />
    );
};
