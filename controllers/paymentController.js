

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
      const { bookingData, totalCost } = req.body;
      console.log('Booking Data:', bookingData);
console.log('Total Cost:', totalCost);

  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Car Booking - ${bookingData.car}`,
              },
              unit_amount: totalCost * 100, // Stripe expects the amount in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_DOMAIN}/user/success`,
        cancel_url: `${process.env.CLIENT_DOMAIN}/user/cancel`,
      });
  
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create payment session" });
    }
  };