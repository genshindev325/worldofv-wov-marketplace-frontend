import Web3 from "web3";

export default function parseJwt(jwt: string): string {
    const data = Buffer.from(jwt.split(".")[1], "base64").toString();
    const payload = JSON.parse(data);
    return Web3.utils.toChecksumAddress(payload.address);
}
