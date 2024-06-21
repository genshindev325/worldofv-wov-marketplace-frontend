import { gql } from "graphql-request";

export const QueryGetLatestConversionRates = gql`
    query GetLatestConversionRates {
        rates: getLatestConversionRates {
            currency
            priceUSD
        }
    }
`;
