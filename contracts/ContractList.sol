// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Importing web3 Libraries from OpenZeppelin
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract ContractList is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _contractIds;

    error AddressAlreadyExists();
    error AddressDoesNotExist();
    // error InsufficientPayment(uint transactionAmount, uint price);
    error WithdrawFailed();

    event AddedAddress(address _address, uint addressCount);
    event RemovedAddress(address _address, uint addressCount);

    string public name;
    // uint public price;
    mapping(uint => address) addresses;
    
    constructor(string memory _name) payable {
        name = _name;
    }

    function add(address _address) public {
        // if(msg.value < price)
        //     revert InsufficientPayment(msg.value, price);

        uint id = _contractIds.current();
        for(uint i = 0; i < id; i++) {
            // require(addresses[i] != _address);
            if(addresses[1] == _address)
                revert AddressAlreadyExists();
        }
        addresses[id] = _address;
        _contractIds.increment();

        emit AddedAddress(_address,_contractIds.current());
    }

    function get(uint contractId) public view returns (address) {
        return addresses[contractId];
    }

    function remove(address _address) public {
        // if(msg.value < price)
        //     revert InsufficientPayment(msg.value, price);

        int id = int(_contractIds.current());
        int index = -1;
        console.log("* remove: _address=", _address);
        for(int i = 0; i < id; i++) {
            // require(addresses[i] != _address);
            if(addresses[uint(i)] == _address) {
                index = i;
                break;
            }
            console.log("--- != ", addresses[uint(i)]);
        }
        if(index == -1)
            revert AddressDoesNotExist();

        for(int i = index; i < id - 1; i++)
            addresses[uint(i)] = addresses[uint(i+1)];
        addresses[uint(index)] = address(0);
        _contractIds.decrement();

        emit RemovedAddress(_address, _contractIds.current());
    }

    function withdraw() public onlyOwner {
        uint amount = address(this).balance;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        // require(success, "Failed to withdraw Matic");
        if(!success) revert WithdrawFailed();
    }

    function getAll() public view returns (address[] memory) {
        console.log("Getting all addresses from contract");
        address[] memory all = new address[](_contractIds.current());
        for (uint i = 0; i < _contractIds.current(); i++) {
            all[i] = addresses[i];
            console.log("Address %d is %s", i, addresses[i]);
        }

        return all;
    }

    function count() public view returns (uint) {
        return _contractIds.current();
    }
}
