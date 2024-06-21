import BurnMintingPFP from "@contracts/BurnMintingPFP.json";
import DelegationStaking from "@contracts/DelegationStaking.json";
import DynamicNFT from "@contracts/DynamicNFT.json";
import PFPBurning from "@contracts/PFPBurning.json";
import PFPStaking from "@contracts/PFPStaking.json";
import StandardNFT from "@contracts/StandardNFT.json";
import VerocketRouter02 from "@contracts/VerocketRouter02.json";
import VeTransfer from "@contracts/VeTransfer.json";
import VexchangeRouter02 from "@contracts/VexchangeRouter02.json";
import VTHOContract from "@contracts/VTHOContract.json";
import WorldOfVBidAuction from "@contracts/WorldOfVBidAuction.json";
import WorldOfVGovernanceToken from "@contracts/WorldOfVGovernanceToken.json";
import WorldOfVOffer from "@contracts/WorldOfVOffer.json";
import WorldOfVOpenMarketplaceAccount from "@contracts/WorldOfVOpenMarketplaceAccount.json";
import WorldOfVOpenMarketplaceToken from "@contracts/WorldOfVOpenMarketplaceToken.json";
import WorldOfVSaleV2 from "@contracts/WorldOfVSaleV2.json";
import WorldOfVSaleV3 from "@contracts/WorldOfVSaleV3.json";
import WrappedVET from "@contracts/WrappedVET.json";
import LZString from "lz-string";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * We use an API endpoint to fetch the ABI encoded in base64 and we decode
 * it in memory because it's not great to give all the users access to the raw
 * contract.
 * This is not ideal as the ABI is not encrypted in any way and pretty easy to
 * decode but it should at least deter unmotivated users so they don't mess with
 * the raw contracts.
 */

export enum ContractId {
    BurnMintingPFP,
    DelegationStaking,
    DynamicNFT,
    PFPBurning,
    PFPStaking,
    StandardNFT,
    VerocketRouter02,
    VeTransfer,
    VexchangeRouter02,
    VTHOContract,
    WorldOfVBidAuction,
    WorldOfVGovernanceToken,
    WorldOfVOffer,
    WorldOfVOpenMarketplaceAccount,
    WorldOfVOpenMarketplaceToken,
    WorldOfVSaleV2,
    WorldOfVSaleV3,
    WrappedVET,
}

export const ABI_MAPPING: Record<ContractId, any> = {
    [ContractId.BurnMintingPFP]: BurnMintingPFP,
    [ContractId.DelegationStaking]: DelegationStaking,
    [ContractId.DynamicNFT]: DynamicNFT,
    [ContractId.PFPBurning]: PFPBurning,
    [ContractId.PFPStaking]: PFPStaking,
    [ContractId.StandardNFT]: StandardNFT,
    [ContractId.VerocketRouter02]: VerocketRouter02,
    [ContractId.VeTransfer]: VeTransfer,
    [ContractId.VexchangeRouter02]: VexchangeRouter02,
    [ContractId.VTHOContract]: VTHOContract,
    [ContractId.WorldOfVBidAuction]: WorldOfVBidAuction,
    [ContractId.WorldOfVGovernanceToken]: WorldOfVGovernanceToken,
    [ContractId.WorldOfVOffer]: WorldOfVOffer,
    [ContractId.WorldOfVOpenMarketplaceAccount]: WorldOfVOpenMarketplaceAccount,
    [ContractId.WorldOfVOpenMarketplaceToken]: WorldOfVOpenMarketplaceToken,
    [ContractId.WorldOfVSaleV2]: WorldOfVSaleV2,
    [ContractId.WorldOfVSaleV3]: WorldOfVSaleV3,
    [ContractId.WrappedVET]: WrappedVET,
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const name = parseInt(req.query.name as string);
        const abi = ABI_MAPPING[name as ContractId];

        if (!abi) {
            res.status(400).json({ error: "Contract not found." });
        }

        const serialized = JSON.stringify(abi);
        const compressed = LZString.compressToBase64(serialized);
        res.status(200).send(compressed);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
