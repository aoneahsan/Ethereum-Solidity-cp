// SPDX-License-Identifier: MIT
pragma solidity >=0.4.16 <0.9.0;

contract CompaignFactor {
    Compaign[] public deployedContracts;

    function createCompaign(uint256 minCompaignContribution) public {
        Compaign deployedContract = new Compaign(
            minCompaignContribution,
            msg.sender
        );

        deployedContracts.push(deployedContract);
    }

    function getDeployedContracts() public view returns (Compaign[] memory) {
        return deployedContracts;
    }
}

contract Compaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        // new after cgaing approvers to a mapping
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint256 public minimumContribution;
    // address[] public approvers; // before moving to mapping
    mapping(address => bool) public approvers;
    uint256 public requestsCount;
    mapping(uint256 => Request) public requests;
    uint256 public compaignApproversCount;
    uint256 public finalizedRequestsCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
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
        Request storage newRequest = requests[requestsCount++];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage r = requests[index];

        require(approvers[msg.sender]);
        require(!r.approvals[msg.sender]);

        r.approvals[msg.sender] = true;
        r.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage r = requests[index];

        require(!r.complete);
        require(r.approvalCount > (compaignApproversCount / 2));

        r.recipient.transfer(r.value);
        r.complete = true;
        finalizedRequestsCount++;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            uint256,
            uint256
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requestsCount,
            compaignApproversCount,
            manager,
            finalizedRequestsCount,
            requestsCount - finalizedRequestsCount // requests waiting approval from approvers
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requestsCount;
    }

    function getRequestDetails(uint256 index)
        public
        view
        returns (
            string memory,
            uint256,
            address payable,
            bool,
            // new after cgaing approvers to a mapping
            uint256,
            uint256 // total approvers available in this compaign
        )
    {
        Request storage request = requests[index];
        return (
            request.description,
            request.value,
            request.recipient,
            request.complete,
            request.approvalCount,
            compaignApproversCount
        );
    }
}
