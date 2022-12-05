import FactoryContract from "../contracts/metadata/Factory.json";
import VestingContract from "../contracts/metadata/Vesting.json";
import TokenContract from "../contracts/metadata/Token.json";
import { Contract } from "ethers";

const FACTORY = "0xFA58dBa4748E180A678c20dcAFFCad1179D1926C";

export const getAllVestings = async (signer, vestingOwner) => {
    const factoryContract = new Contract(FACTORY, FactoryContract, signer);

    const result = await factoryContract.getAllVestings(vestingOwner);
    return result;
};

export const createVesting = async (
    signer,
    vestingOwner,
    beneficiary,
    token,
    start,
    cliffDuration,
    duration,
    supply,
    revokable,
    createToken,
    name,
    symbol
) => {
    const factoryContract = new Contract(FACTORY, FactoryContract, signer);
    return await factoryContract.createVesting(
        vestingOwner,
        beneficiary,
        token.length ? token : beneficiary,
        start,
        cliffDuration,
        duration,
        supply,
        revokable,
        createToken,
        name,
        symbol
    );
};
