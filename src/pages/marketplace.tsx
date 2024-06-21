import Head from "@/components/Head";
import { MarketplacePageContent } from "@/components/marketplace/MarketplacePageContent";
import { MarketplaceProvider } from "@/providers/MarketplaceProvider";
import { NextPage } from "next";
import { NextQueryParamProvider } from "next-query-params";

const Marketplace: NextPage = () => (
    <>
        <Head title="Marketplace" />
        {/*
          We use NextQueryParamProvider at a page level instead of globally
          bc there is a bug where the state is being shared among unrelated pages
        */}
        <NextQueryParamProvider>
            <MarketplaceProvider>
                <MarketplacePageContent />
            </MarketplaceProvider>
        </NextQueryParamProvider>
    </>
);

export default Marketplace;
