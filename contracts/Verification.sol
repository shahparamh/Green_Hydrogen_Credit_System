// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HydrogenCredits.sol";

contract Verification {
    HydrogenCredits public ghc;
    address public oracle;

    constructor(address _ghc, address _oracle) {
        ghc = HydrogenCredits(_ghc);
        oracle = _oracle;
    }

    function verifyProduction(address producer, uint256 amount) external {
        require(msg.sender == oracle, "Only oracle can verify");
        ghc.issueCredits(producer, amount);
    }
}
