const main = async () => {
    const [owner/*, superCoder*/] = await hre.ethers.getSigners();
    const contractFactory = await hre.ethers.getContractFactory('ContractList');

    console.log("Contract owner:", owner.address);

    // Let's look in their wallet so we can compare later
    let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log("Balance of owner before deployment:", hre.ethers.utils.formatEther(ownerBalance));

    const contract = await contractFactory.deploy("Examples");
    await contract.deployed();

    const name = await contract.name();

    // console.log(`* Contract deployed to ${process.env.HARDHAT_NETWORK}: ${contract.address}`);
    console.log(`* Contract deployed to ${hre.network.name}: ${contract.address} as "${name}"`);

    // contract.on('AddedAddress', (address, count) => console.log(`Address Added: ${address} (count=${count})`));
    // contract.on('RemovedAddress', (address, count) => console.log(`Address Added: ${address} (count=${count})`));

    // let txn = await contract.add('0x7F6a53E8b4cD1599566F26dd8c66edeA0257c34D');
    // await txn.wait();

    // txn = await contract.add('0x6a2a321fd64721670e1b4259899d7b6b25c37ed1');
    // await txn.wait();

    // // let addresses = await contract.addresses();
    // let addresses = await contract.getAll();
    // console.log(`addresses: `, addresses);

    // txn = await contract.remove('0x6a2a321fd64721670e1b4259899d7b6b25c37ed1');
    // await txn.wait();

    // txn = await contract.remove('0x7F6a53E8b4cD1599566F26dd8c66edeA0257c34D');
    // await txn.wait();

    // // addresses = await contract.addresses();
    // addresses = await contract.getAll();
    // console.log(`addresses: `, addresses);

    // Fetch balance of contract & owner
    const contractBalance = await hre.ethers.provider.getBalance(contract.address);
    ownerBalance = await hre.ethers.provider.getBalance(owner.address);

    console.log("Final Contract balance:", hre.ethers.utils.formatEther(contractBalance));
    console.log("Final Balance of owner:", hre.ethers.utils.formatEther(ownerBalance));
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();