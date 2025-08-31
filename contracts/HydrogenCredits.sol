// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title HydrogenCredits
 * @dev ERC20 token representing Green Hydrogen Credits with role-based access control
 * @author GreenH2 Team
 * @notice This contract manages the minting, transfer, and retirement of green hydrogen credits
 * @custom:security-contact security@greenh2.com
 */
contract HydrogenCredits is ERC20, AccessControl, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Role definitions
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant CERTIFIER_ROLE = keccak256("CERTIFIER_ROLE");
    bytes32 public constant BUYER_ROLE = keccak256("BUYER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant REGULATOR_ROLE = keccak256("REGULATOR_ROLE");

    // Credit certificate structure
    struct CreditCertificate {
        uint256 certificateId;
        address producer;
        address certifier;
        uint256 amount;
        uint256 timestamp;
        string metadataHash; // IPFS hash for certificate details
        string location;
        string productionMethod;
        uint256 carbonIntensity; // gCO2/kWh
        bool isRetired;
        uint256 retirementTimestamp;
        string retirementReason;
    }

    // State variables
    Counters.Counter private _certificateIds;
    mapping(uint256 => CreditCertificate) public certificates;
    mapping(address => uint256[]) public producerCertificates;
    mapping(address => uint256[]) public certifierCertificates;
    mapping(address => uint256[]) public buyerCertificates;
    
    // Credit tracking
    mapping(address => uint256) public totalProduced;
    mapping(address => uint256) public totalRetired;
    
    // Events
    event CreditsMinted(
        uint256 indexed certificateId,
        address indexed producer,
        address indexed certifier,
        uint256 amount,
        string metadataHash,
        string location,
        string productionMethod,
        uint256 carbonIntensity
    );
    
    event CreditsTransferred(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256[] certificateIds
    );
    
    event CreditsRetired(
        uint256 indexed certificateId,
        address indexed holder,
        uint256 amount,
        string reason,
        uint256 timestamp
    );
    
    event CertificateMetadataUpdated(
        uint256 indexed certificateId,
        string newMetadataHash
    );
    
    event RoleGranted(
        bytes32 indexed role,
        address indexed account,
        address indexed sender
    );
    
    event RoleRevoked(
        bytes32 indexed role,
        address indexed account,
        address indexed sender
    );

    // Modifiers
    modifier onlyRole(bytes32 role) {
        require(hasRole(role, msg.sender), "HydrogenCredits: insufficient permissions");
        _;
    }
    
    modifier onlyActiveCertificate(uint256 certificateId) {
        require(certificates[certificateId].certificateId != 0, "Certificate does not exist");
        require(!certificates[certificateId].isRetired, "Certificate already retired");
        _;
    }

    /**
     * @dev Constructor sets up initial roles and grants DEFAULT_ADMIN_ROLE to msg.sender
     * @param _name Token name
     * @param _symbol Token symbol
     */
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGULATOR_ROLE, msg.sender);
        
        // Grant initial roles to deployer
        _grantRole(PRODUCER_ROLE, msg.sender);
        _grantRole(CERTIFIER_ROLE, msg.sender);
        _grantRole(BUYER_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender);
    }

    /**
     * @dev Mint new credits for verified green hydrogen production
     * @param producer Address of the hydrogen producer
     * @param amount Amount of credits to mint
     * @param metadataHash IPFS hash containing certificate metadata
     * @param location Geographic location of production facility
     * @param productionMethod Method used for hydrogen production
     * @param carbonIntensity Carbon intensity in gCO2/kWh
     */
    function mintCredits(
        address producer,
        uint256 amount,
        string memory metadataHash,
        string memory location,
        string memory productionMethod,
        uint256 carbonIntensity
    ) external onlyRole(CERTIFIER_ROLE) whenNotPaused nonReentrant {
        require(producer != address(0), "Invalid producer address");
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(metadataHash).length > 0, "Metadata hash required");
        require(bytes(location).length > 0, "Location required");
        require(bytes(productionMethod).length > 0, "Production method required");
        require(carbonIntensity <= 1000, "Carbon intensity too high"); // Max 1000 gCO2/kWh

        // Generate unique certificate ID
        _certificateIds.increment();
        uint256 certificateId = _certificateIds.current();

        // Create certificate
        certificates[certificateId] = CreditCertificate({
            certificateId: certificateId,
            producer: producer,
            certifier: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            metadataHash: metadataHash,
            location: location,
            productionMethod: productionMethod,
            carbonIntensity: carbonIntensity,
            isRetired: false,
            retirementTimestamp: 0,
            retirementReason: ""
        });

        // Update tracking
        producerCertificates[producer].push(certificateId);
        certifierCertificates[msg.sender].push(certificateId);
        totalProduced[producer] += amount;

        // Mint tokens
        _mint(producer, amount);

        emit CreditsMinted(
            certificateId,
            producer,
            msg.sender,
            amount,
            metadataHash,
            location,
            productionMethod,
            carbonIntensity
        );
    }

    /**
     * @dev Transfer credits between addresses with certificate tracking
     * @param to Recipient address
     * @param amount Amount to transfer
     * @param certificateIds Array of certificate IDs being transferred
     */
    function transferWithCertificates(
        address to,
        uint256 amount,
        uint256[] memory certificateIds
    ) external whenNotPaused nonReentrant returns (bool) {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        require(certificateIds.length > 0, "Certificate IDs required");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Verify certificate ownership and validity
        uint256 totalCertifiedAmount = 0;
        for (uint256 i = 0; i < certificateIds.length; i++) {
            require(
                _isCertificateOwner(msg.sender, certificateIds[i]),
                "Not certificate owner"
            );
            require(
                !certificates[certificateIds[i]].isRetired,
                "Certificate retired"
            );
            totalCertifiedAmount += certificates[certificateIds[i]].amount;
        }
        require(totalCertifiedAmount >= amount, "Insufficient certified amount");

        // Update certificate tracking
        for (uint256 i = 0; i < certificateIds.length; i++) {
            buyerCertificates[to].push(certificateIds[i]);
        }

        // Transfer tokens
        bool success = transfer(to, amount);
        require(success, "Transfer failed");

        emit CreditsTransferred(msg.sender, to, amount, certificateIds);
        return true;
    }

    /**
     * @dev Retire credits permanently (e.g., for carbon offset claims)
     * @param amount Amount of credits to retire
     * @param certificateIds Array of certificate IDs to retire
     * @param reason Reason for retirement
     */
    function retireCredits(
        uint256 amount,
        uint256[] memory certificateIds,
        string memory reason
    ) external whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(certificateIds.length > 0, "Certificate IDs required");
        require(bytes(reason).length > 0, "Retirement reason required");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Verify certificate ownership and calculate total
        uint256 totalCertifiedAmount = 0;
        for (uint256 i = 0; i < certificateIds.length; i++) {
            require(
                _isCertificateOwner(msg.sender, certificateIds[i]),
                "Not certificate owner"
            );
            require(
                !certificates[certificateIds[i]].isRetired,
                "Certificate already retired"
            );
            totalCertifiedAmount += certificates[certificateIds[i]].amount;
        }
        require(totalCertifiedAmount >= amount, "Insufficient certified amount");

        // Mark certificates as retired
        for (uint256 i = 0; i < certificateIds.length; i++) {
            certificates[certificateIds[i]].isRetired = true;
            certificates[certificateIds[i]].retirementTimestamp = block.timestamp;
            certificates[certificateIds[i]].retirementReason = reason;
        }

        // Update tracking
        totalRetired[msg.sender] += amount;

        // Burn tokens
        _burn(msg.sender, amount);

        emit CreditsRetired(
            certificateIds[0], // Use first certificate ID for event
            msg.sender,
            amount,
            reason,
            block.timestamp
        );
    }

    /**
     * @dev Update certificate metadata (only by original certifier or regulator)
     * @param certificateId ID of the certificate to update
     * @param newMetadataHash New IPFS hash for metadata
     */
    function updateCertificateMetadata(
        uint256 certificateId,
        string memory newMetadataHash
    ) external onlyActiveCertificate(certificateId) {
        require(
            hasRole(REGULATOR_ROLE, msg.sender) ||
            certificates[certificateId].certifier == msg.sender,
            "Insufficient permissions"
        );
        require(bytes(newMetadataHash).length > 0, "Invalid metadata hash");

        certificates[certificateId].metadataHash = newMetadataHash;

        emit CertificateMetadataUpdated(certificateId, newMetadataHash);
    }

    /**
     * @dev Get certificate details by ID
     * @param certificateId ID of the certificate
     * @return Certificate details
     */
    function getCertificate(uint256 certificateId) external view returns (CreditCertificate memory) {
        return certificates[certificateId];
    }

    /**
     * @dev Get all certificates for a producer
     * @param producer Address of the producer
     * @return Array of certificate IDs
     */
    function getProducerCertificates(address producer) external view returns (uint256[] memory) {
        return producerCertificates[producer];
    }

    /**
     * @dev Get all certificates certified by a certifier
     * @param certifier Address of the certifier
     * @return Array of certificate IDs
     */
    function getCertifierCertificates(address certifier) external view returns (uint256[] memory) {
        return certifierCertificates[certifier];
    }

    /**
     * @dev Get all certificates owned by a buyer
     * @param buyer Address of the buyer
     * @return Array of certificate IDs
     */
    function getBuyerCertificates(address buyer) external view returns (uint256[] memory) {
        return buyerCertificates[buyer];
    }

    /**
     * @dev Get total production and retirement statistics for an address
     * @param account Address to check
     * @return produced Total credits produced
     * @return retired Total credits retired
     */
    function getAccountStats(address account) external view returns (uint256 produced, uint256 retired) {
        return (totalProduced[account], totalRetired[account]);
    }

    /**
     * @dev Pause all operations (emergency only)
     */
    function pause() external onlyRole(REGULATOR_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause operations
     */
    function unpause() external onlyRole(REGULATOR_ROLE) {
        _unpause();
    }

    /**
     * @dev Grant role to an address
     * @param role Role to grant
     * @param account Address to grant role to
     */
    function grantRole(bytes32 role, address account) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(role, account);
        emit RoleGranted(role, account, msg.sender);
    }

    /**
     * @dev Revoke role from an address
     * @param role Role to revoke
     * @param account Address to revoke role from
     */
    function revokeRole(bytes32 role, address account) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(role, account);
        emit RoleRevoked(role, account, msg.sender);
    }

    /**
     * @dev Check if an address owns a specific certificate
     * @param owner Address to check
     * @param certificateId Certificate ID to check
     * @return True if owner owns the certificate
     */
    function _isCertificateOwner(address owner, uint256 certificateId) internal view returns (bool) {
        // Check if owner is the original producer
        if (certificates[certificateId].producer == owner) {
            return true;
        }
        
        // Check if owner has received the certificate through transfer
        uint256[] memory buyerCerts = buyerCertificates[owner];
        for (uint256 i = 0; i < buyerCerts.length; i++) {
            if (buyerCerts[i] == certificateId) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * @dev Override _beforeTokenTransfer to add pausable functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev Override supportsInterface for AccessControl
     */
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC20) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
