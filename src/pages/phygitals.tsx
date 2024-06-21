import Head from "@/components/Head";
import { PhygitalsPageContent } from "@/components/phygitals/PhygitalsPageContent";
import { PhygitalsProvider } from "@/providers/PhygitalsProvider";
import { NextPage } from "next";
import { NextQueryParamProvider } from "next-query-params";

const Phygitals: NextPage = () => (
    <>
        <Head title="Phygitals" />
        {/*
          We use NextQueryParamProvider at a page level instead of globally
          bc there is a bug where the state is being shared among unrelated pages
        */}
        <NextQueryParamProvider>
            <PhygitalsProvider>
                <PhygitalsPageContent />
            </PhygitalsProvider>
        </NextQueryParamProvider>
    </>
);

export default Phygitals;
