// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Ubook
 * @author uBOOK Team
 * @notice Decentralized booking platform with escrow
 * @dev Accommodations and bookings stored on-chain; funds held in escrow until completion or cancellation
 */
contract Ubook is Ownable, ReentrancyGuard {
    enum BookingStatus { Pending, Deposited, Confirmed, Completed, Cancelled }

    struct Accommodation {
        uint256 id;
        address host;
        string name;
        string location;
        string accType; // hotel, homestay, restaurant-hotel
        uint256 pricePerNight; // in CELO (wei)
        uint8 rating; // 0-255
        bool available;
        string[] images;
        string[] amenities;
    }

    struct Booking {
        uint256 id;
        uint256 accommodationId;
        address guest;
        uint256 checkIn;
        uint256 checkOut;
        uint8 nights;
        uint256 pricePerNight;
        uint256 total;
        uint256 deposit; // amount in escrow
        BookingStatus status;
        uint256 createdAt;
        uint256 completedAt;
    }

    address public admin;
    uint16 public platformFeeBps = 500; // 5% cancellation fee
    uint256 public accommodationCounter;
    uint256 public bookingCounter;

    mapping(uint256 => Accommodation) public accommodations;
    mapping(uint256 => Booking) public bookings;
    mapping(address => bool) public whitelistedHosts;
    mapping(uint256 => uint256) public escrowBalances; // bookingId => amount

    event AccommodationCreated(uint256 indexed accId, address indexed host);
    event BookingCreated(uint256 indexed bookingId, uint256 indexed accId, address indexed guest, uint256 deposit);
    event BookingConfirmed(uint256 indexed bookingId);
    event BookingCompleted(uint256 indexed bookingId, uint256 releasedToAdmin);
    event BookingCancelled(uint256 indexed bookingId, uint256 refundToGuest, uint256 feeToAdmin);

    constructor() Ownable(msg.sender) {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyWhitelistedOrAdmin() {
        require(whitelistedHosts[msg.sender] || msg.sender == admin, "Not whitelisted");
        _;
    }

    /**
     * @notice Create an accommodation listing
     * @param name e.g. "Lake Victoria Hotel"
     * @param location e.g. "Entebbe, Central Region"
     * @param accType e.g. "hotel"
     * @param pricePerNight in wei
     * @param rating 0-255
     * @param available initial availability
     * @param images array of URLs
     * @param amenities e.g. ["WiFi", "Pool"]
     */
    function createAccommodation(
        string calldata name,
        string calldata location,
        string calldata accType,
        uint256 pricePerNight,
        uint8 rating,
        bool available,
        string[] calldata images,
        string[] calldata amenities
    ) external onlyWhitelistedOrAdmin {
        uint256 id = ++accommodationCounter;
        accommodations[id] = Accommodation(id, msg.sender, name, location, accType, pricePerNight, rating, available, images, amenities);
        emit AccommodationCreated(id, msg.sender);
    }

    /**
     * @notice Toggle availability of an accommodation
     */
    function setAvailability(uint256 accId, bool available) external {
        require(accommodations[accId].host == msg.sender || msg.sender == admin, "Not authorized");
        accommodations[accId].available = available;
    }

    /**
     * @notice Create a booking and deposit funds to escrow
     * @dev Requires payment with transaction; deposit must not exceed total
     */
    function createBooking(uint256 accId, uint256 checkIn, uint256 checkOut) external payable nonReentrant {
        Accommodation memory acc = accommodations[accId];
        require(acc.available, "Not available");
        require(checkOut > checkIn, "Invalid dates");

        uint8 nights = uint8((checkOut - checkIn) / 1 days);
        uint256 total = acc.pricePerNight * nights;
        require(msg.value > 0 && msg.value <= total, "Invalid deposit");

        uint256 id = ++bookingCounter;
        bookings[id] = Booking(id, accId, msg.sender, checkIn, checkOut, nights, acc.pricePerNight, total, msg.value, BookingStatus.Deposited, block.timestamp, 0);
        escrowBalances[id] = msg.value;
        emit BookingCreated(id, accId, msg.sender, msg.value);
    }

    /**
     * @notice Cancel a booking by guest (before check-in only)
     * @dev Refunds 95% to guest, 5% to admin
     */
    function cancelBooking(uint256 bookingId) external nonReentrant {
        Booking storage b = bookings[bookingId];
        require(msg.sender == b.guest, "Not your booking");
        require(block.timestamp < b.checkIn, "Too late to cancel");
        require(b.status == BookingStatus.Deposited, "Cannot cancel");

        uint256 fee = (b.deposit * platformFeeBps) / 10000;
        uint256 refund = b.deposit - fee;

        b.status = BookingStatus.Cancelled;
        escrowBalances[bookingId] = 0;

        (bool sent,) = payable(msg.sender).call{value: refund}("");
        require(sent, "Refund failed");
        if (fee > 0) {
            (bool feeSent,) = payable(admin).call{value: fee}("");
            require(feeSent, "Fee transfer failed");
        }
        emit BookingCancelled(bookingId, refund, fee);
    }

    /**
     * @notice Complete a booking and release escrow to admin (platform)
     * @dev Only admin can call after stay completion
     */
    function completeBooking(uint256 bookingId) external onlyAdmin nonReentrant {
        Booking storage b = bookings[bookingId];
        require(b.status == BookingStatus.Deposited, "Invalid status");

        b.status = BookingStatus.Completed;
        b.completedAt = block.timestamp;
        uint256 amount = escrowBalances[bookingId];
        escrowBalances[bookingId] = 0;

        (bool sent,) = payable(admin).call{value: amount}("");
        require(sent, "Transfer failed");
        emit BookingCompleted(bookingId, amount);
    }

    /**
     * @notice Admin-only: whitelist/unwhitelist hosts
     */
    function whitelistHost(address host, bool allowed) external onlyAdmin {
        whitelistedHosts[host] = allowed;
    }

    /**
     * @notice Admin-only: update platform fee
     */
    function setPlatformFee(uint16 bps) external onlyAdmin {
        require(bps <= 10000, "Invalid fee");
        platformFeeBps = bps;
    }

    /**
     * @notice Read an accommodation by ID
     */
    function getAccommodation(uint256 accId) external view returns (Accommodation memory) {
        return accommodations[accId];
    }

    /**
     * @notice Read a booking by ID
     */
    function getBooking(uint256 bookingId) external view returns (Booking memory) {
        return bookings[bookingId];
    }

    /**
     * @notice Get escrow balance for a booking
     */
    function getEscrowBalance(uint256 bookingId) external view returns (uint256) {
        return escrowBalances[bookingId];
    }

    // Fallback for empty ETH sends
    receive() external payable {}

    fallback() external payable {}
}


