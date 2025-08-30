// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HydrogenCredits is ERC20, Ownable {
    address public verifier;

    event CreditsIssued(address indexed producer, uint256 amount);
    event CreditsRetired(address indexed holder, uint256 amount);
    event VerifierChanged(address indexed oldVerifier, address indexed newVerifier);

    constructor(address _verifier) ERC20("HydrogenCredits", "HGC") Ownable(msg.sender) {
        verifier = _verifier;
    }

    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can issue credits");
        _;
    }

    function setVerifier(address _newVerifier) external onlyOwner {
        address oldVerifier = verifier;
        verifier = _newVerifier;
        emit VerifierChanged(oldVerifier, _newVerifier);
    }

    function issueCredits(address producer, uint256 amount) external onlyVerifier {
        _mint(producer, amount);
        emit CreditsIssued(producer, amount);
    }

    function retireCredits(uint256 amount) external {
        _burn(msg.sender, amount);
        emit CreditsRetired(msg.sender, amount);
    }
}
