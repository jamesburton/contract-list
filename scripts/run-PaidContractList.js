const main = async () => {
    const [owner, superCoder] = await hre.ethers.getSigners();
    const contractFactory = await hre.ethers.getContractFactory('PaidContractList');

    console.log("Contract owner:", owner.address);

    // Let's look in their wallet so we can compare later
    let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log("Balance of owner before deployment:", hre.ethers.utils.formatEther(ownerBalance));

    const contract = await contractFactory.deploy("Paid Examples", hre.ethers.utils.parseEther('0.01'));
    await contract.deployed();

    const name = await contract.name();

    // console.log(`* Contract deployed to ${process.env.HARDHAT_NETWORK}: ${contract.address}`);
    console.log(`* Contract deployed to ${hre.network.name}: ${contract.address} as "${name}"`);

    contract.on('AddedAddress', (address, count) => console.log(`Address Added: ${address} (count=${count})`));
    contract.on('RemovedAddress', (address, count) => console.log(`Address Added: ${address} (count=${count})`));

    // Add address #1
    let txn = await contract.add('0x7F6a53E8b4cD1599566F26dd8c66edeA0257c34D', {value: hre.ethers.utils.parseEther('0.01')});
    await txn.wait();

    // Add address #2
    txn = await contract.add('0x6a2a321fd64721670e1b4259899d7b6b25c37ed1', {value: hre.ethers.utils.parseEther('0.01')});
    await txn.wait();

    // List addresses
    let addresses = await contract.getAll();
    console.log(`addresses: `, addresses);

    // Remove address #2
    txn = await contract.remove('0x6a2a321fd64721670e1b4259899d7b6b25c37ed1', {value: hre.ethers.utils.parseEther('0.01')});
    await txn.wait();

    // Fail to remove address #1 due to lack of payment
    let error = undefined;
    try {
        txn = await contract.remove('0x7F6a53E8b4cD1599566F26dd8c66edeA0257c34D');
        await txn.wait();
    } catch(ex) {
        console.log(`Trapped expected exception attempting to remove from PaidContractList without payment.`);
        error = ex;
    }
    if(!error)
        throw new Error('Expected lack-of-value exception when removing without payment');

    // Fail to remove address #2 due to insufficient payment
    try {
        txn = await contract.remove('0x7F6a53E8b4cD1599566F26dd8c66edeA0257c34D', {value: hre.ethers.utils.parseEther('0.005')});
        await txn.wait();
    } catch(ex) {
        console.log(`Trapped expected exception attempting to remove from PaidContractList without payment.`);
        error = ex;
    }
    if(!error)
        throw new Error('Expected lack-of-value exception when removing without payment');

    // Remove address #2 with correct payment
    txn = await contract.remove('0x7F6a53E8b4cD1599566F26dd8c66edeA0257c34D', {value: hre.ethers.utils.parseEther('0.010')});
    await txn.wait();

    // List final (empty) address list
    addresses = await contract.getAll();
    console.log(`addresses: `, addresses);

    // Fetch balance of contract & owner after transactions
    let contractBalance = await hre.ethers.provider.getBalance(contract.address);
    ownerBalance = await hre.ethers.provider.getBalance(owner.address);

    console.log("Final Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    // Quick! Grab the funds from the contract! (as superCoder)
    try {
        txn = await contract.connect(superCoder).withdraw();
        await txn.wait();
    } catch(error){
        console.log("Could not rob contract");
    }

    // Let's look in their wallet so we can compare later
    ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

    // Oops, looks like the owner is saving their money!
    txn = await contract.connect(owner).withdraw();
    await txn.wait();
    
    // Fetch balance of contract & owner
    contractBalance = await hre.ethers.provider.getBalance(contract.address);
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