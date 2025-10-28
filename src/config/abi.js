// Smart Contract ABI for Booking Escrow
// This is the structure for the smart contract that will be deployed on Celo

export const BOOKING_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_escrowAdmin', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'bookingId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'guest', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'BookingCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'bookingId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'reason', type: 'string' }
    ],
    name: 'BookingCancelled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'bookingId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'admin', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'FundsReleased',
    type: 'event'
  },
  {
    inputs: [
      { internalType: 'string', name: 'accommodationId', type: 'string' },
      { internalType: 'uint256', name: 'checkIn', type: 'uint256' },
      { internalType: 'uint256', name: 'checkOut', type: 'uint256' },
      { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }
    ],
    name: 'createBooking',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_bookingId', type: 'uint256' }
    ],
    name: 'depositCelo',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_bookingId', type: 'uint256' }
    ],
    name: 'completeBooking',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_bookingId', type: 'uint256' },
      { internalType: 'string', name: '_reason', type: 'string' }
    ],
    name: 'cancelBooking',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'bookings',
    outputs: [
      { internalType: 'uint256', name: 'bookingId', type: 'uint256' },
      { internalType: 'address', name: 'guest', type: 'address' },
      { internalType: 'string', name: 'accommodationId', type: 'string' },
      { internalType: 'uint256', name: 'checkIn', type: 'uint256' },
      { internalType: 'uint256', name: 'checkOut', type: 'uint256' },
      { internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'depositedAmount', type: 'uint256' },
      { internalType: 'uint8', name: 'status', type: 'uint8' },
      { internalType: 'bool', name: 'isCompleted', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'nextBookingId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
];

// Contract address will be set after deployment
// For now, this is a placeholder
export const BOOKING_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';


