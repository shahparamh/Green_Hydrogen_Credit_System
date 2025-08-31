// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HydrogenCredits.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Verification
 * @dev Smart contract for verifying green hydrogen production and minting credits
 * @author GreenH2 Team
 * @notice This contract handles the verification process for green hydrogen production
 * @custom:security-contact security@greenh2.com
 */
contract Verification is AccessControl, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Role definitions
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    // Contract references
    HydrogenCredits public immutable ghc;
    
    // Verification request structure
    struct VerificationRequest {
        uint256 requestId;
        address producer;
        uint256 amount;
        string metadataHash; // IPFS hash for verification documents
        string location;
        string productionMethod;
        uint256 carbonIntensity;
        uint256 timestamp;
        VerificationStatus status;
        address verifier;
        uint256 verificationTimestamp;
        string verificationNotes;
        bool isApproved;
    }

    // Verification status
    enum VerificationStatus { PENDING, VERIFIED, REJECTED, EXPIRED }

    // State variables
    Counters.Counter private _requestIds;
    mapping(uint256 => VerificationRequest) public verificationRequests;
    mapping(address => uint256[]) public producerRequests;
    mapping(address => uint256[]) public verifierRequests;
    
    // Verification settings
    uint256 public verificationTimeout = 30 days;
    uint256 public minVerificationAmount = 1;
    uint256 public maxVerificationAmount = 1000000;
    uint256 public maxCarbonIntensity = 1000; // gCO2/kWh
    
    // Events
    event VerificationRequested(
        uint256 indexed requestId,
        address indexed producer,
        uint256 amount,
        string metadataHash,
        string location,
        string productionMethod,
        uint256 carbonIntensity
    );
    
    event VerificationCompleted(
        uint256 indexed requestId,
        address indexed producer,
        address indexed verifier,
        uint256 amount,
        bool isApproved,
        string verificationNotes
    );
    
    event VerificationExpired(
        uint256 indexed requestId,
        address indexed producer,
        uint256 amount
    );
    
    event OracleAdded(
        address indexed oracle,
        address indexed sender
    );
    
    event OracleRemoved(
        address indexed oracle,
        address indexed sender
    );

    // Modifiers
    modifier onlyOracle() {
        require(hasRole(ORACLE_ROLE, msg.sender), "Only oracle can call this function");
        _;
    }
    
    modifier onlyVerifier() {
        require(hasRole(VERIFIER_ROLE, msg.sender), "Only verifier can call this function");
        _;
    }
    
    modifier onlyActiveRequest(uint256 requestId) {
        require(verificationRequests[requestId].requestId != 0, "Request does not exist");
        require(verificationRequests[requestId].status == VerificationStatus.PENDING, "Request not pending");
        require(
            verificationRequests[requestId].timestamp + verificationTimeout > block.timestamp,
            "Request expired"
        );
        _;
    }

    /**
     * @dev Constructor initializes the verification contract
     * @param _ghc Address of the HydrogenCredits contract
     */
    constructor(address _ghc) {
        require(_ghc != address(0), "Invalid GHC address");
        
        ghc = HydrogenCredits(_ghc);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender);
    }

    /**
     * @dev Request verification for green hydrogen production
     * @param amount Amount of credits to verify
     * @param metadataHash IPFS hash for verification documents
     * @param location Geographic location of production facility
     * @param productionMethod Method used for hydrogen production
     * @param carbonIntensity Carbon intensity in gCO2/kWh
     */
    function requestVerification(
        uint256 amount,
        string memory metadataHash,
        string memory location,
        string memory productionMethod,
        uint256 carbonIntensity
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(amount >= minVerificationAmount, "Amount too low");
        require(amount <= maxVerificationAmount, "Amount too high");
        require(bytes(metadataHash).length > 0, "Metadata hash required");
        require(bytes(location).length > 0, "Location required");
        require(bytes(productionMethod).length > 0, "Production method required");
        require(carbonIntensity <= maxCarbonIntensity, "Carbon intensity too high");

        // Generate unique request ID
        _requestIds.increment();
        uint256 requestId = _requestIds.current();

        // Create verification request
        verificationRequests[requestId] = VerificationRequest({
            requestId: requestId,
            producer: msg.sender,
            amount: amount,
            metadataHash: metadataHash,
            location: location,
            productionMethod: productionMethod,
            carbonIntensity: carbonIntensity,
            timestamp: block.timestamp,
            status: VerificationStatus.PENDING,
            verifier: address(0),
            verificationTimestamp: 0,
            verificationNotes: "",
            isApproved: false
        });

        // Update tracking
        producerRequests[msg.sender].push(requestId);

        emit VerificationRequested(
            requestId,
            msg.sender,
            amount,
            metadataHash,
            location,
            productionMethod,
            carbonIntensity
        );

        return requestId;
    }

    /**
     * @dev Complete verification process (only by verifiers)
     * @param requestId ID of the verification request
     * @param isApproved Whether the verification is approved
     * @param verificationNotes Notes from the verification process
     */
    function completeVerification(
        uint256 requestId,
        bool isApproved,
        string memory verificationNotes
    ) external onlyVerifier onlyActiveRequest(requestId) whenNotPaused nonReentrant {
        VerificationRequest storage request = verificationRequests[requestId];
        
        // Update request status
        request.status = VerificationStatus.VERIFIED;
        request.verifier = msg.sender;
        request.verificationTimestamp = block.timestamp;
        request.verificationNotes = verificationNotes;
        request.isApproved = isApproved;

        // Update tracking
        verifierRequests[msg.sender].push(requestId);

        if (isApproved) {
            // Mint credits through the GHC contract
            try ghc.mintCredits(
                request.producer,
                request.amount,
                request.metadataHash,
                request.location,
                request.productionMethod,
                request.carbonIntensity
            ) {
                // Success - credits minted
            } catch Error(string memory reason) {
                // Revert the verification if minting fails
                request.status = VerificationStatus.REJECTED;
                request.isApproved = false;
                revert(string(abi.encodePacked("Credit minting failed: ", reason)));
            }
        }

        emit VerificationCompleted(
            requestId,
            request.producer,
            msg.sender,
            request.amount,
            isApproved,
            verificationNotes
        );
    }

    /**
     * @dev Oracle can directly verify and mint credits (for automated systems)
     * @param producer Address of the hydrogen producer
     * @param amount Amount of credits to mint
     * @param metadataHash IPFS hash for verification documents
     * @param location Geographic location of production facility
     * @param productionMethod Method used for hydrogen production
     * @param carbonIntensity Carbon intensity in gCO2/kWh
     */
    function oracleVerify(
        address producer,
        uint256 amount,
        string memory metadataHash,
        string memory location,
        string memory productionMethod,
        uint256 carbonIntensity
    ) external onlyOracle whenNotPaused nonReentrant {
        require(producer != address(0), "Invalid producer address");
        require(amount >= minVerificationAmount, "Amount too low");
        require(amount <= maxVerificationAmount, "Amount too high");
        require(bytes(metadataHash).length > 0, "Metadata hash required");
        require(bytes(location).length > 0, "Location required");
        require(bytes(productionMethod).length > 0, "Production method required");
        require(carbonIntensity <= maxCarbonIntensity, "Carbon intensity too high");

        // Mint credits directly through the GHC contract
        ghc.mintCredits(
            producer,
            amount,
            metadataHash,
            location,
            productionMethod,
            carbonIntensity
        );
    }

    /**
     * @dev Check for expired verification requests and mark them as expired
     * @param requestIds Array of request IDs to check
     */
    function checkExpiredRequests(uint256[] memory requestIds) external {
        uint256 currentTime = block.timestamp;
        
        for (uint256 i = 0; i < requestIds.length; i++) {
            uint256 requestId = requestIds[i];
            VerificationRequest storage request = verificationRequests[requestId];
            
            if (request.status == VerificationStatus.PENDING &&
                request.timestamp + verificationTimeout <= currentTime) {
                
                request.status = VerificationStatus.EXPIRED;
                
                emit VerificationExpired(
                    requestId,
                    request.producer,
                    request.amount
                );
            }
        }
    }

    /**
     * @dev Get verification request details by ID
     * @param requestId ID of the verification request
     * @return Verification request details
     */
    function getVerificationRequest(uint256 requestId) external view returns (VerificationRequest memory) {
        return verificationRequests[requestId];
    }

    /**
     * @dev Get all verification requests for a producer
     * @param producer Address of the producer
     * @return Array of request IDs
     */
    function getProducerRequests(address producer) external view returns (uint256[] memory) {
        return producerRequests[producer];
    }

    /**
     * @dev Get all verification requests handled by a verifier
     * @param verifier Address of the verifier
     * @return Array of request IDs
     */
    function getVerifierRequests(address verifier) external view returns (uint256[] memory) {
        return verifierRequests[verifier];
    }

    /**
     * @dev Get pending verification requests (for frontend display)
     * @param limit Maximum number of requests to return
     * @return Array of pending verification requests
     */
    function getPendingRequests(uint256 limit) external view returns (VerificationRequest[] memory) {
        uint256 pendingCount = 0;
        uint256[] memory tempRequestIds = new uint256[](limit);
        
        // Count pending requests
        for (uint256 i = 1; i <= _requestIds.current() && pendingCount < limit; i++) {
            if (verificationRequests[i].status == VerificationStatus.PENDING &&
                verificationRequests[i].timestamp + verificationTimeout > block.timestamp) {
                tempRequestIds[pendingCount] = i;
                pendingCount++;
            }
        }

        // Create result array
        VerificationRequest[] memory result = new VerificationRequest[](pendingCount);
        for (uint256 i = 0; i < pendingCount; i++) {
            result[i] = verificationRequests[tempRequestIds[i]];
        }

        return result;
    }

    /**
     * @dev Add oracle address (admin only)
     * @param oracle Address to add as oracle
     */
    function addOracle(address oracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(oracle != address(0), "Invalid oracle address");
        grantRole(ORACLE_ROLE, oracle);
        emit OracleAdded(oracle, msg.sender);
    }

    /**
     * @dev Remove oracle address (admin only)
     * @param oracle Address to remove as oracle
     */
    function removeOracle(address oracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(oracle != address(0), "Invalid oracle address");
        revokeRole(ORACLE_ROLE, oracle);
        emit OracleRemoved(oracle, msg.sender);
    }

    /**
     * @dev Update verification settings (admin only)
     * @param _verificationTimeout New verification timeout
     * @param _minVerificationAmount New minimum verification amount
     * @param _maxVerificationAmount New maximum verification amount
     * @param _maxCarbonIntensity New maximum carbon intensity
     */
    function updateVerificationSettings(
        uint256 _verificationTimeout,
        uint256 _minVerificationAmount,
        uint256 _maxVerificationAmount,
        uint256 _maxCarbonIntensity
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_verificationTimeout > 0, "Invalid timeout");
        require(_minVerificationAmount > 0, "Invalid min amount");
        require(_maxVerificationAmount > _minVerificationAmount, "Invalid max amount");
        require(_maxCarbonIntensity <= 2000, "Carbon intensity too high");

        verificationTimeout = _verificationTimeout;
        minVerificationAmount = _minVerificationAmount;
        maxVerificationAmount = _maxVerificationAmount;
        maxCarbonIntensity = _maxCarbonIntensity;
    }

    /**
     * @dev Pause verification operations (emergency only)
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause verification operations
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Grant role to an address
     * @param role Role to grant
     * @param account Address to grant role to
     */
    function grantRole(bytes32 role, address account) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(role, account);
    }

    /**
     * @dev Revoke role from an address
     * @param role Role to revoke
     * @param account Address to revoke role from
     */
    function revokeRole(bytes32 role, address account) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(role, account);
    }

    /**
     * @dev Override supportsInterface for AccessControl
     */
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
