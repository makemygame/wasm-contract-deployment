import { CodePromise, Abi, ContractPromise } from '@polkadot/api-contract';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { BN, BN_ONE } from '@polkadot/util';
// import .contract file as json string
import { json } from "./abi.js"

const MAX_CALL_WEIGHT = new BN(500_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);

try {
    let address; // variable for storing the address of the deployed contract 

    // API creation for connection to the chain
    const wsProvider = new WsProvider('wss://wss-testnet.5ire.network/');
    const api = await ApiPromise.create({ provider: wsProvider });


    // gas limit for deployment
    //const gasLimit = 100000n * 1000000n
    const gasLimit = api.registry.createType('WeightV2', {
        refTime: MAX_CALL_WEIGHT,
        proofSize: PROOFSIZE,
      });


    // adding fire account for paying the gas fee
    const PHRASE = 'negative cheap cherry uncover absurd angle swarm armor tuna lounge hurdle lawsuit';
    const keyring = new Keyring({ type: "ed25519" });
    const userKeyring = keyring.addFromMnemonic(PHRASE);
    // parameters for constructor function inside the contract

    const contract = new ContractPromise(api, json, '5Czfe1m8zPaRuwBrByyPkesgz7cE4ZUNX3dWnwAzVAKDkEVu');

    //console.log(await contract.query);
    // Query value from contract
    const { result, output } = await contract.query.balanceOf(
        userKeyring.address,
        {
            gasLimit: gasLimit,
            storageDepositLimit: null,
        }, '5GhS8ddBoA9pbUz1Z49Wh9Kx36MoHLZrVTNk2dj6R93hqd6m'
    );
    // check if the call was successful
    if (result.isOk) {
        // output the return value
        console.log('Success -> Value:', output.toHuman());
    } else {
        console.error('Error', result.asErr);
    }
}
catch (err) {
    console.log("error", err.toString())
}
