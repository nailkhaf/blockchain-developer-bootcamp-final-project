pragma solidity ^0.8.0;

contract Voting {

    event VoterRegistered(address indexed voter);
    event NewCampaign(address indexed issuer, uint256 indexed campaignId);
    event VoteRegistered(address indexed voter);

    modifier checkValue(uint256 value) {
        require(msg.value == value, "Wrong value");
        _;
    }

    modifier onlyVoteOnce(address voter) {
        // require(, "");
        _;
    }

    function registerVoter(address voter) external {

    }

    function newCampaign(uint256 campaignId) external {

    }

    function registerVote(uint256 campaignId) external {

    }

    function revealVote() external {

    }

    function campaign(uint256 campaignId) public view returns() {

    }
}
