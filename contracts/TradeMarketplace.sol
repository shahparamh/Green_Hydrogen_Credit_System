// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HydrogenCredits.sol";

contract TradeMarketplace {
    HydrogenCredits public ghc;

    struct Order {
        address seller;
        uint256 amount;
        uint256 price; // price per credit in wei
        bool active;
    }

    uint public nextOrderId;
    mapping(uint => Order) public orders;

    event OrderPlaced(uint indexed orderId, address indexed seller, uint256 amount, uint256 price);
    event OrderFilled(uint indexed orderId, address indexed buyer, uint256 amount, uint256 totalPrice);

    constructor(address _ghc) {
        ghc = HydrogenCredits(_ghc);
        nextOrderId = 0;
    }

    /// @notice Seller places an order: must approve marketplace for `amount` beforehand
    function placeOrder(uint256 amount, uint256 price) external {
        require(amount > 0, "amount > 0");
        require(price > 0, "price > 0");
        // move tokens from seller to marketplace as escrow
        require(ghc.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");
        bool ok = ghc.transferFrom(msg.sender, address(this), amount);
        require(ok, "transferFrom failed");

        orders[nextOrderId] = Order(msg.sender, amount, price, true);
        emit OrderPlaced(nextOrderId, msg.sender, amount, price);
        nextOrderId++;
    }

    /// @notice Buyer fills the order, sending exactly `amount * price` wei
    function fillOrder(uint orderId) external payable {
        Order storage order = orders[orderId];
        require(order.active, "Order inactive");
        uint256 total = order.amount * order.price;
        require(msg.value == total, "Incorrect ETH sent");

        order.active = false;

        // transfer tokens from marketplace to buyer
        require(ghc.transfer(msg.sender, order.amount), "transfer failed");

        // transfer ETH to seller
        payable(order.seller).transfer(msg.value);

        emit OrderFilled(orderId, msg.sender, order.amount, msg.value);
    }
}
