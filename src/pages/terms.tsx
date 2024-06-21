import type { NextPage } from "next";
import Head from "../components/Head";
import TermsContent from "../components/Terms/TermsContent";

const Terms: NextPage = () => (
    <>
        <Head title="Terms & Conditions" />
        <TermsContent />
    </>
);

export default Terms;
