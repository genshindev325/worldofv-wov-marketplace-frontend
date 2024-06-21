import type { NextPage } from "next";
import Head from "../components/Head";
import PrivacyPolicyContent from "../components/PrivacyPolicy/PrivacyPolicyContent";

const Privacy: NextPage = () => (
    <>
        <Head title="Privacy Policy" />
        <PrivacyPolicyContent />
    </>
);

export default Privacy;
