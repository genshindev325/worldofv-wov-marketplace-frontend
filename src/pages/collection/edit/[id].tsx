import { isUUID } from "class-validator";
import { NextPageContext } from "next";
import { QueryGetCollection } from "../../../graphql/get-collection.graphql";
import { GraphQLService } from "../../../services/GraphQLService";
import CreateCollection from "../create";

export async function getServerSideProps(context: NextPageContext) {
    const identifier = context.query?.id as string;

    if (identifier) {
        const res = await GraphQLService.client().request(
            QueryGetCollection,
            isUUID(identifier)
                ? { collectionId: identifier }
                : { customUrl: identifier }
        );

        if (res) {
            return { props: { collection: res.collection } };
        }
    }

    return {
        redirect: {
            destination: "/collection/create",
        },
    };
}

export default CreateCollection;
