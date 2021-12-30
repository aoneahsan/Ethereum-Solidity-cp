// SPDX-License-Identifier: MIT
pragma solidity >=0.4.16 <0.9.0;

contract Lottery {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        // new after cgaing approvers to a mapping
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint256 public minimumContribution;
    // address[] public approvers; // before moving to mapping
    mapping(address => bool) public approvers;
    uint numRequests;
    mapping(uint => Request) requests;
    uint compaignApproversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum) {
        manager = msg.sender;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        // setting this contributor true in approvers mapping/object 
        approvers[msg.sender] = true;
        compaignApproversCount++;
    }

    function createRequest(
        string calldata description,
        uint256 value,
        address payable recipient
    ) public restricted {
        Request storage newRequest = requests[numRequests++];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage r = requests[index];

        require(approvers[msg.sender]);
        require(!r.approvals[msg.sender]);

        r.approvals[msg.sender] = true;
        r.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage r = requests[index];

        require(!r.complete);
        require(r.approvalCount > (compaignApproversCount/2));
        
        r.recipient.transfer(r.value);
        r.complete = true;
    }
}
