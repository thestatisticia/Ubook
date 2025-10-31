// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title BookingEscrow
 * @notice Smart contract for booking accommodation with escrow payments
 * @dev Holds CELO in escrow until booking is completed
 */
contract BookingEscrow {
    address public immutable escrowAdmin;
    uint256 public nextBookingId;
    
    enum BookingStatus {
        Pending,      // 0 - Booking created, awaiting deposit
        Deposited,    // 1 - Deposit received, admin to book
        Confirmed,    // 2 - Admin confirmed booking
        Completed,    // 3 - Stay completed, funds released
        Cancelled     // 4 - Booking cancelled, refund pending
    }
    
    struct Booking {
        uint256 bookingId;
        address guest;
        string accommodationId;
        uint256 checkIn;
        uint256 checkOut;
        uint256 totalAmount;      // Total amount in wei
        uint256 depositedAmount;   // Amount deposited in wei
        BookingStatus status;
        bool isCompleted;
        uint256 createdAt;
        uint256 completedAt;
    }
    
    mapping(uint256 => Booking) public bookings;
    mapping(address => uint256[]) public userBookings;
    
    event BookingCreated(
        uint256 indexed bookingId,
        address indexed guest,
        string indexed accommodationId,
        uint256 totalAmount,
        uint256 checkIn,
        uint256 checkOut
    );
    
    event DepositReceived(
        uint256 indexed bookingId,
        address indexed guest,
        uint256 amount
    );
    
    event BookingConfirmed(
        uint256 indexed bookingId,
        address indexed admin
    );
    
    event BookingCompleted(
        uint256 indexed bookingId,
        uint256 amount
    );
    
    event BookingCancelled(
        uint256 indexed bookingId,
        address indexed guest,
        string reason,
        uint256 refundAmount
    );
    
    event FundsReleased(
        uint256 indexed bookingId,
        address indexed admin,
        address indexed to,
        uint256 amount
    );
    
    error InvalidBookingId();
    error AlreadyDeposited();
    error InsufficientDeposit();
    error NotAuthorized();
    error BookingNotDeposited();
    error BookingAlreadyCompleted();
    error InvalidDates();
    error TransactionFailed();
    
    modifier onlyAdmin() {
        require(msg.sender == escrowAdmin, "Not authorized");
        _;
    }
    
    modifier bookingExists(uint256 _bookingId) {
        require(bookings[_bookingId].bookingId != 0, "Booking not found");
        _;
    }
    
    constructor(address _escrowAdmin) {
        require(_escrowAdmin != address(0), "Invalid admin address");
        escrowAdmin = _escrowAdmin;
        nextBookingId = 1;
    }
    
    /**
     * @notice Create a new booking
     * @param _accommodationId Accommodation identifier
     * @param _checkIn Check-in timestamp
     * @param _checkOut Check-out timestamp
     * @param _totalAmount Total price in wei
     * @return bookingId The ID of the created booking
     */
    function createBooking(
        string memory _accommodationId,
        uint256 _checkIn,
        uint256 _checkOut,
        uint256 _totalAmount
    ) external returns (uint256) {
        require(bytes(_accommodationId).length > 0, "Invalid accommodation ID");
        require(_checkIn >= block.timestamp, "Check-in must be in future");
        require(_checkOut > _checkIn, "Check-out must be after check-in");
        require(_totalAmount > 0, "Amount must be greater than 0");
        
        uint256 bookingId = nextBookingId++;
        
        bookings[bookingId] = Booking({
            bookingId: bookingId,
            guest: msg.sender,
            accommodationId: _accommodationId,
            checkIn: _checkIn,
            checkOut: _checkOut,
            totalAmount: _totalAmount,
            depositedAmount: 0,
            status: BookingStatus.Pending,
            isCompleted: false,
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        userBookings[msg.sender].push(bookingId);
        
        emit BookingCreated(
            bookingId,
            msg.sender,
            _accommodationId,
            _totalAmount,
            _checkIn,
            _checkOut
        );
        
        return bookingId;
    }
    
    /**
     * @notice Deposit CELO to booking
     * @param _bookingId The ID of the booking
     */
    function depositCelo(uint256 _bookingId) 
        external 
        payable 
        bookingExists(_bookingId)
    {
        Booking storage booking = bookings[_bookingId];
        
        require(msg.sender == booking.guest, "Not the booking guest");
        require(booking.status == BookingStatus.Pending, "Booking not pending");
        require(msg.value == booking.totalAmount, "Incorrect deposit amount");
        require(msg.value > 0, "Must deposit CELO");
        
        booking.depositedAmount = msg.value;
        booking.status = BookingStatus.Deposited;
        
        emit DepositReceived(_bookingId, msg.sender, msg.value);
    }
    
    /**
     * @notice Admin confirms booking has been made
     * @param _bookingId The ID of the booking
     */
    function confirmBooking(uint256 _bookingId) 
        external 
        onlyAdmin
        bookingExists(_bookingId)
    {
        Booking storage booking = bookings[_bookingId];
        
        require(booking.status == BookingStatus.Deposited, "Booking not deposited");
        
        booking.status = BookingStatus.Confirmed;
        
        emit BookingConfirmed(_bookingId, msg.sender);
    }
    
    /**
     * @notice Complete booking and release funds to admin
     * @param _bookingId The ID of the booking
     */
    function completeBooking(uint256 _bookingId) 
        external 
        onlyAdmin
        bookingExists(_bookingId)
    {
        Booking storage booking = bookings[_bookingId];
        
        require(booking.status == BookingStatus.Confirmed, "Booking not confirmed");
        require(!booking.isCompleted, "Booking already completed");
        
        booking.isCompleted = true;
        booking.status = BookingStatus.Completed;
        booking.completedAt = block.timestamp;
        
        uint256 amount = booking.depositedAmount;
        
        (bool success, ) = escrowAdmin.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit BookingCompleted(_bookingId, amount);
        emit FundsReleased(_bookingId, msg.sender, escrowAdmin, amount);
    }
    
    /**
     * @notice Cancel booking and refund guest
     * @param _bookingId The ID of the booking
     * @param _reason Reason for cancellation
     */
    function cancelBooking(uint256 _bookingId, string memory _reason) 
        external 
        onlyAdmin
        bookingExists(_bookingId)
    {
        Booking storage booking = bookings[_bookingId];
        
        require(
            booking.status == BookingStatus.Pending || 
            booking.status == BookingStatus.Deposited || 
            booking.status == BookingStatus.Confirmed,
            "Cannot cancel completed booking"
        );
        
        uint256 refundAmount = booking.depositedAmount;
        
        if (refundAmount > 0) {
            booking.status = BookingStatus.Cancelled;
            
            (bool success, ) = booking.guest.call{value: refundAmount}("");
            require(success, "Refund failed");
            
            emit BookingCancelled(_bookingId, booking.guest, _reason, refundAmount);
        } else {
            booking.status = BookingStatus.Cancelled;
            emit BookingCancelled(_bookingId, booking.guest, _reason, 0);
        }
    }
    
    /**
     * @notice Get booking details
     * @param _bookingId The ID of the booking
     * @return Full booking struct
     */
    function getBooking(uint256 _bookingId) 
        external 
        view 
        returns (Booking memory)
    {
        require(bookings[_bookingId].bookingId != 0, "Booking not found");
        return bookings[_bookingId];
    }
    
    /**
     * @notice Get all bookings for a user
     * @param _user User address
     * @return Array of booking IDs
     */
    function getUserBookings(address _user) 
        external 
        view 
        returns (uint256[] memory)
    {
        return userBookings[_user];
    }
    
    /**
     * @notice Get contract balance
     * @return Balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @notice Check if user has bookings
     * @param _user User address
     * @return True if user has bookings
     */
    function hasBookings(address _user) external view returns (bool) {
        return userBookings[_user].length > 0;
    }
    
    /**
     * @notice Get booking count for user
     * @param _user User address
     * @return Number of bookings
     */
    function getBookingCount(address _user) external view returns (uint256) {
        return userBookings[_user].length;
    }
}







