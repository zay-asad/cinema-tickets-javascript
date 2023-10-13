import TicketService from '../src/pairtest/TicketService';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException';

// Mock external dependencies
jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService');
jest.mock('../src/thirdparty/seatbooking/SeatReservationService');

describe('TicketService', () => {
    // Test for _validatePurchase method
    it('should throw Exception for invalid purchase', () => {
        const ticketService = new TicketService();
        const invalidPurchase = () => {
            ticketService._validatePurchase([{ type: 'CHILD', noOfTickets: 0 }]);
        };
        expect(invalidPurchase).toThrow(InvalidPurchaseException);
    });

    // Test for _calculateTotalPrice method
    it('should calculate and return the total price correctly for two adults and one child', () => {
        const ticketService = new TicketService();
        const totalPrice = ticketService._calculateTotalPrice([
            { type: 'ADULT', noOfTickets: 2 },
            { type: 'CHILD', noOfTickets: 1 },
        ]);
        expect(totalPrice).toEqual(50);
    });

});
