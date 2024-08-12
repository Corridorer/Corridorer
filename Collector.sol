// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract collect {
    struct Signature {
        address wallet;
        bytes signature;
    }

    Signature[] public signatures;
    mapping(address => bool) public hasSigned;
    uint public constant MAX_SIGNATURES = 100;

    event SignatureCollected(address indexed wallet, bytes signature);

    function addSignature(bytes memory _signature) public {
        require(signatures.length < MAX_SIGNATURES, "Max signatures collected");
        require(!hasSigned[msg.sender], "Address has already signed");

        signatures.push(Signature(msg.sender, _signature));
        hasSigned[msg.sender] = true;

        emit SignatureCollected(msg.sender, _signature);
    }

    function getSignatures() public view returns (Signature[] memory) {
        return signatures;
    }
}



