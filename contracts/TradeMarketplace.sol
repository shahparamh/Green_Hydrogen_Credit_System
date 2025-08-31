// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HydrogenCredits.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title TradeMarketplace
 * @dev Decentralized marketplace for trading Green Hydrogen Credits
 * @author GreenH2 Team
 * @notice This contract enables peer-to-peer trading of verified green hydrogen credits
 * @custom:security-contact security@greenh2.com
 */
contract TradeMarketplace is ReentrancyGuard, Pausable, AccessControl {
    using Counters for Counters.Counter;

    // Role definitions
    bytes32 public constant MARKETPLACE_ADMIN_ROLE = keccak256("MARKETPLACE_ADMIN_ROLE");
    bytes32 public constant LIQUIDITY_PROVIDER_ROLE = keccak256("LIQUIDITY_PROVIDER_ROLE");

    // Contract references
    HydrogenCredits public immutable ghc;
    
    // Order structure
    struct Order {
        uint256 orderId;
        address seller;
        uint256 amount;
        uint256 pricePerCredit; // Price in wei per credit
        uint256 totalPrice; // Total price in wei
        bool active;
        uint256 timestamp;
        uint256 expiryTime;
        string description;
        uint256[] certificateIds; // Associated certificate IDs
        OrderType orderType;
        OrderStatus status;
    }

    // Order types
    enum OrderType { BUY, SELL }
    enum OrderStatus { ACTIVE, FILLED, CANCELLED, EXPIRED }

    // State variables
    Counters.Counter private _orderIds;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;
    mapping(address => uint256) public userOrderCount;
    
    // Fee structure (in basis points, 100 = 1%)
    uint256 public platformFee = 25; // 0.25%
    uint256 public maxPlatformFee = 100; // 1%
    address public feeCollector;
    
    // Order limits
    uint256 public minOrderAmount = 1; // Minimum credits per order
    uint256 public maxOrderAmount = 1000000; // Maximum credits per order
    uint256 public orderExpiryTime = 7 days; // Default expiry time
    
    // Events
    event OrderPlaced(
        uint256 indexed orderId,
        address indexed seller,
        uint256 amount,
        uint256 pricePerCredit,
        uint256 totalPrice,
        OrderType orderType,
        string description
    );
    
    event OrderFilled(
        uint256 indexed orderId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 totalPrice,
        uint256 platformFee
    );
    
    event OrderCancelled(
        uint256 indexed orderId,
        address indexed seller,
        uint256 amount
    );
    
    event OrderExpired(
        uint256 indexed orderId,
        address indexed seller,
        uint256 amount
    );
    
    event PlatformFeeUpdated(
        uint256 oldFee,
        uint256 newFee
    );
    
    event FeeCollectorUpdated(
        address oldCollector,
        address newCollector
    );

    // Modifiers
    modifier onlyActiveOrder(uint256 orderId) {
        require(orders[orderId].orderId != 0, "Order does not exist");
        require(orders[orderId].status == OrderStatus.ACTIVE, "Order not active");
        require(orders[orderId].expiryTime > block.timestamp, "Order expired");
        _;
    }
    
    modifier onlyOrderOwner(uint256 orderId) {
        require(orders[orderId].seller == msg.sender, "Not order owner");
        _;
    }
    
    modifier onlyRole(bytes32 role) {
        require(hasRole(role, msg.sender), "Insufficient permissions");
        _;
    }

    /**
     * @dev Constructor initializes the marketplace
     * @param _ghc Address of the HydrogenCredits contract
     * @param _feeCollector Address to receive platform fees
     */
    constructor(
        address _ghc,
        address _feeCollector
    ) {
        require(_ghc != address(0), "Invalid GHC address");
        require(_feeCollector != address(0), "Invalid fee collector");
        
        ghc = HydrogenCredits(_ghc);
        feeCollector = _feeCollector;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MARKETPLACE_ADMIN_ROLE, msg.sender);
        _grantRole(LIQUIDITY_PROVIDER_ROLE, msg.sender);
    }

    /**
     * @dev Place a sell order for hydrogen credits
     * @param amount Amount of credits to sell
     * @param pricePerCredit Price per credit in wei
     * @param description Description of the credits being sold
     * @param certificateIds Array of certificate IDs to sell
     */
    function placeSellOrder(
        uint256 amount,
        uint256 pricePerCredit,
        string memory description,
        uint256[] memory certificateIds
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(amount >= minOrderAmount, "Amount too low");
        require(amount <= maxOrderAmount, "Amount too high");
        require(pricePerCredit > 0, "Invalid price");
        require(bytes(description).length > 0, "Description required");
        require(certificateIds.length > 0, "Certificate IDs required");
        require(ghc.balanceOf(msg.sender) >= amount, "Insufficient credits");
        
        // Verify certificate ownership
        uint256 totalCertifiedAmount = 0;
        for (uint256 i = 0; i < certificateIds.length; i++) {
            require(
                _isCertificateOwner(msg.sender, certificateIds[i]),
                "Not certificate owner"
            );
            totalCertifiedAmount += _getCertificateAmount(certificateIds[i]);
        }
        require(totalCertifiedAmount >= amount, "Insufficient certified amount");

        // Transfer credits to marketplace as escrow
        require(
            ghc.transferFrom(msg.sender, address(this), amount),
            "Credit transfer failed"
        );

        // Create order
        _orderIds.increment();
        uint256 orderId = _orderIds.current();
        
        orders[orderId] = Order({
            orderId: orderId,
            seller: msg.sender,
            amount: amount,
            pricePerCredit: pricePerCredit,
            totalPrice: amount * pricePerCredit,
            active: true,
            timestamp: block.timestamp,
            expiryTime: block.timestamp + orderExpiryTime,
            description: description,
            certificateIds: certificateIds,
            orderType: OrderType.SELL,
            status: OrderStatus.ACTIVE
        });

        // Update user tracking
        userOrders[msg.sender].push(orderId);
        userOrderCount[msg.sender]++;

        emit OrderPlaced(
            orderId,
            msg.sender,
            amount,
            pricePerCredit,
            amount * pricePerCredit,
            OrderType.SELL,
            description
        );

        return orderId;
    }

    /**
     * @dev Place a buy order (market maker functionality)
     * @param amount Amount of credits to buy
     * @param pricePerCredit Maximum price per credit in wei
     * @param description Description of the buy order
     */
    function placeBuyOrder(
        uint256 amount,
        uint256 pricePerCredit,
        string memory description
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(amount >= minOrderAmount, "Amount too low");
        require(amount <= maxOrderAmount, "Amount too high");
        require(pricePerCredit > 0, "Invalid price");
        require(bytes(description).length > 0, "Description required");
        require(msg.value >= amount * pricePerCredit, "Insufficient ETH");

        // Create order
        _orderIds.increment();
        uint256 orderId = _orderIds.current();
        
        orders[orderId] = Order({
            orderId: orderId,
            seller: msg.sender,
            amount: amount,
            pricePerCredit: pricePerCredit,
            totalPrice: amount * pricePerCredit,
            active: true,
            timestamp: block.timestamp,
            expiryTime: block.timestamp + orderExpiryTime,
            description: description,
            certificateIds: new uint256[](0), // Empty for buy orders
            orderType: OrderType.BUY,
            status: OrderStatus.ACTIVE
        });

        // Update user tracking
        userOrders[msg.sender].push(orderId);
        userOrderCount[msg.sender]++;

        emit OrderPlaced(
            orderId,
            msg.sender,
            amount,
            pricePerCredit,
            amount * pricePerCredit,
            OrderType.BUY,
            description
        );

        return orderId;
    }

    /**
     * @dev Fill a sell order by buying credits
     * @param orderId ID of the order to fill
     */
    function fillSellOrder(uint256 orderId) external payable whenNotPaused nonReentrant {
        Order storage order = orders[orderId];
        require(order.orderType == OrderType.SELL, "Not a sell order");
        require(order.status == OrderStatus.ACTIVE, "Order not active");
        require(order.expiryTime > block.timestamp, "Order expired");
        require(msg.value == order.totalPrice, "Incorrect ETH amount");
        require(msg.sender != order.seller, "Cannot buy from self");

        // Calculate platform fee
        uint256 platformFeeAmount = (order.totalPrice * platformFee) / 10000;
        uint256 sellerAmount = order.totalPrice - platformFeeAmount;

        // Update order status
        order.status = OrderStatus.FILLED;
        order.active = false;

        // Transfer credits to buyer
        require(
            ghc.transfer(msg.sender, order.amount),
            "Credit transfer failed"
        );

        // Transfer ETH to seller (minus platform fee)
        payable(order.seller).transfer(sellerAmount);

        // Transfer platform fee
        payable(feeCollector).transfer(platformFeeAmount);

        emit OrderFilled(
            orderId,
            msg.sender,
            order.seller,
            order.amount,
            order.totalPrice,
            platformFeeAmount
        );
    }

    /**
     * @dev Fill a buy order by selling credits
     * @param orderId ID of the order to fill
     * @param certificateIds Array of certificate IDs to sell
     */
    function fillBuyOrder(
        uint256 orderId,
        uint256[] memory certificateIds
    ) external whenNotPaused nonReentrant {
        Order storage order = orders[orderId];
        require(order.orderType == OrderType.BUY, "Not a buy order");
        require(order.status == OrderStatus.ACTIVE, "Order not active");
        require(order.expiryTime > block.timestamp, "Order expired");
        require(msg.sender != order.seller, "Cannot sell to self");
        require(certificateIds.length > 0, "Certificate IDs required");

        // Verify certificate ownership and amount
        uint256 totalCertifiedAmount = 0;
        for (uint256 i = 0; i < certificateIds.length; i++) {
            require(
                _isCertificateOwner(msg.sender, certificateIds[i]),
                "Not certificate owner"
            );
            totalCertifiedAmount += _getCertificateAmount(certificateIds[i]);
        }
        require(totalCertifiedAmount >= order.amount, "Insufficient certified amount");

        // Transfer credits to buyer
        require(
            ghc.transferFrom(msg.sender, order.seller, order.amount),
            "Credit transfer failed"
        );

        // Update order status
        order.status = OrderStatus.FILLED;
        order.active = false;

        // Transfer ETH to seller
        payable(msg.sender).transfer(order.totalPrice);

        emit OrderFilled(
            orderId,
            order.seller,
            msg.sender,
            order.amount,
            order.totalPrice,
            0 // No platform fee for buy orders
        );
    }

    /**
     * @dev Cancel an order (only by order owner)
     * @param orderId ID of the order to cancel
     */
    function cancelOrder(uint256 orderId) external onlyOrderOwner(orderId) {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.ACTIVE, "Order not active");

        order.status = OrderStatus.CANCELLED;
        order.active = false;

        // Return credits if it's a sell order
        if (order.orderType == OrderType.SELL) {
            require(
                ghc.transfer(order.seller, order.amount),
                "Credit return failed"
            );
        }

        emit OrderCancelled(orderId, order.seller, order.amount);
    }

    /**
     * @dev Get order details by ID
     * @param orderId ID of the order
     * @return Order details
     */
    function getOrder(uint256 orderId) external view returns (Order memory) {
        return orders[orderId];
    }

    /**
     * @dev Get all orders for a user
     * @param user Address of the user
     * @return Array of order IDs
     */
    function getUserOrders(address user) external view returns (uint256[] memory) {
        return userOrders[user];
    }

    /**
     * @dev Get active orders (for frontend display)
     * @param orderType Type of orders to return (0 = all, 1 = buy, 2 = sell)
     * @param limit Maximum number of orders to return
     * @return Array of active orders
     */
    function getActiveOrders(
        uint256 orderType,
        uint256 limit
    ) external view returns (Order[] memory) {
        uint256 activeCount = 0;
        uint256[] memory tempOrderIds = new uint256[](limit);
        
        // Count active orders
        for (uint256 i = 1; i <= _orderIds.current() && activeCount < limit; i++) {
            if (orders[i].status == OrderStatus.ACTIVE && 
                orders[i].expiryTime > block.timestamp &&
                (orderType == 0 || 
                 (orderType == 1 && orders[i].orderType == OrderType.BUY) ||
                 (orderType == 2 && orders[i].orderType == OrderType.SELL))) {
                tempOrderIds[activeCount] = i;
                activeCount++;
            }
        }

        // Create result array
        Order[] memory result = new Order[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = orders[tempOrderIds[i]];
        }

        return result;
    }

    /**
     * @dev Update platform fee (admin only)
     * @param newFee New fee in basis points
     */
    function updatePlatformFee(uint256 newFee) external onlyRole(MARKETPLACE_ADMIN_ROLE) {
        require(newFee <= maxPlatformFee, "Fee too high");
        uint256 oldFee = platformFee;
        platformFee = newFee;
        emit PlatformFeeUpdated(oldFee, newFee);
    }

    /**
     * @dev Update fee collector address (admin only)
     * @param newCollector New fee collector address
     */
    function updateFeeCollector(address newCollector) external onlyRole(MARKETPLACE_ADMIN_ROLE) {
        require(newCollector != address(0), "Invalid address");
        address oldCollector = feeCollector;
        feeCollector = newCollector;
        emit FeeCollectorUpdated(oldCollector, newCollector);
    }

    /**
     * @dev Pause marketplace operations (emergency only)
     */
    function pause() external onlyRole(MARKETPLACE_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause marketplace operations
     */
    function unpause() external onlyRole(MARKETPLACE_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Check if an address owns a specific certificate
     * @param owner Address to check
     * @param certificateId Certificate ID to check
     * @return True if owner owns the certificate
     */
    function _isCertificateOwner(address owner, uint256 certificateId) internal view returns (bool) {
        // This would need to be implemented based on the HydrogenCredits contract
        // For now, we'll assume the GHC contract has this functionality
        try ghc.getCertificate(certificateId) returns (HydrogenCredits.CreditCertificate memory cert) {
            return cert.producer == owner;
        } catch {
            return false;
        }
    }

    /**
     * @dev Get the amount of credits for a specific certificate
     * @param certificateId Certificate ID
     * @return Amount of credits
     */
    function _getCertificateAmount(uint256 certificateId) internal view returns (uint256) {
        try ghc.getCertificate(certificateId) returns (HydrogenCredits.CreditCertificate memory cert) {
            return cert.amount;
        } catch {
            return 0;
        }
    }

    /**
     * @dev Emergency function to recover stuck tokens (admin only)
     * @param token Address of the token to recover
     * @param to Address to send tokens to
     * @param amount Amount to recover
     */
    function emergencyRecover(
        address token,
        address to,
        uint256 amount
    ) external onlyRole(MARKETPLACE_ADMIN_ROLE) {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");
        
        if (token == address(0)) {
            // Recover ETH
            payable(to).transfer(amount);
        } else {
            // Recover ERC20 tokens
            require(
                IERC20(token).transfer(to, amount),
                "Token transfer failed"
            );
        }
    }

    /**
     * @dev Receive function for ETH deposits
     */
    receive() external payable {
        // Allow ETH deposits for buy orders
    }

    /**
     * @dev Fallback function
     */
    fallback() external payable {
        revert("Function not found");
    }
}

// Interface for ERC20 tokens
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}
