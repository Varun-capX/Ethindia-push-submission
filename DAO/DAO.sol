// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract DAO {
    address[] public members;

    function addMember(address _member) public {
        members.push(_member);
    }

    function getMembers() public view returns (address[] memory) {
        return members;
    }
}