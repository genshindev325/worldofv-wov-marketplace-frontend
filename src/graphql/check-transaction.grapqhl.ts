import { gql } from "graphql-request";

export const FragmentBlockchainEvent = gql`
    fragment BlockchainEvent on BlockchainEvent {
        address
        meta
        returnValues
        event
        signature
        raw
        jobId
        status
    }
`;

export const SubscriptionCheckTransaction = gql`
    ${FragmentBlockchainEvent}

    subscription CheckTransaction($txID: String!, $eventNames: [String!]) {
        event: checkTransaction(txID: $txID, eventNames: $eventNames) {
            ...BlockchainEvent
        }
    }
`;
