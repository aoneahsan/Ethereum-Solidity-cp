// SPDX-License-Identifier: MIT
pragma solidity >=0.4.16 <0.9.0;

contract Inbox {
    constructor(string memory InitMessage) {
        message = InitMessage;
    }

    string public message;


    function setMessage(string calldata newMessage) public {
        message = newMessage;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}
