import { useRouter } from "next/router";
import { useUserData } from "./useUserData";

export default function useRedirectAnonymous() {
    const { user } = useUserData();
    const router = useRouter();

    const redirectAnonymous = (handler?: (args: any) => void) => {
        return !user ? () => router.push("/login") : handler;
    };

    return { redirectAnonymous };
}
