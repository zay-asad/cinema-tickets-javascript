import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from './TicketPaymentService.js';
import SeatReservationService from './SeatReservationService.js';

export default class TicketService {
  constructor() {
    this.ticketPrices = {
      INFANT: 0,
      CHILD: 10,
      ADULT: 20,
    };
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // Validate the purchase
    this._validatePurchase(ticketTypeRequests);

    // Calculate tot price
    const totalAmountToPay = this._calculateTotalPrice(ticketTypeRequests);

    // Make a payment using the TicketPaymentService
    const paymentService = new TicketPaymentService();
    paymentService.makePayment(accountId, totalAmountToPay);

    // Reserve seats if adult tickets are purchased
    const adultTicketCount = this._getAdultTicketCount(ticketTypeRequests);
    if (adultTicketCount > 0) {
      const seatReservationService = new SeatReservationService();
      seatReservationService.reserveSeat(accountId, adultTicketCount);
    }
  }

  // private method responsible to validate purchases
  _validatePurchase(ticketTypeRequests) {
    const totalTickets = ticketTypeRequests.reduce((total, request) => {
      if (request.type === 'ADULT') {
        return total + request.noOfTickets;
      }
      return total;
    }, 0);

    if (totalTickets === 0 || totalTickets > 20) {
      throw new InvalidPurchaseException('Invalid purchase: Must purchase between 1 and 20 tickets with at least one adult ticket.');
    }
  }

    // Private method responsible to calculate the total price (Only using it as a naming convention with "_" at the start)
  _calculateTotalPrice(ticketTypeRequests) {
    return ticketTypeRequests.reduce((total, request) => {
      return total + this.ticketPrices[request.type] * request.noOfTickets;
    }, 0);
  }

    // Private method responsible to keep count of the number of adult tickets
  _getAdultTicketCount(ticketTypeRequests) {
    return ticketTypeRequests.reduce((count, request) => {
      if (request.type === 'ADULT') {
        return count + request.noOfTickets;
      }
      return count;
    }, 0);
  }
}
