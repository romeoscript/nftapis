import stripePackage from 'stripe';

const stripe = stripePackage('sk_test_51NxI2RCJIXj2AddOi62fWEXIOM1gS3LOiVxgXhrNjxMD16WcVBVfMCELEz6SzbXr4UGOpwrNT6P494SlzUh0hY2u00e9Lzqdjs');


let retainedAmount = null;

const createStripeSession = async (req, res) => {
  const amount = req.body.amount ? req.body.amount * 100 : retainedAmount;

  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  retainedAmount = amount;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Test Product',
        },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'http://localhost:3000/payment-success',
    cancel_url: 'http://localhost:3000/payment-cancelled',
  });

  res.json({ sessionId: session.id });
};

export { createStripeSession };
