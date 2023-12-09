// module.exports = (app) => {
//     var Stripe = require("../controller/Stripe");
//     var router = require("express").Router();

//     router.post("/", Stripe.payment);

//     app.use("/payment", router);
// };
// module.exports = (app) => {
//     var Stripe = require("../controller/Stripe");
//     var router = require("express").Router();

//     router.post("/", Stripe.payment);

//     app.use("/payment", router);
// };
const express = require('express');
const Stripe = require('stripe');
// const app = express();
require('dotenv').config();
const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  const { listCart } = req.body;

  if (!listCart || !Array.isArray(listCart) || listCart.length === 0) {
    return res.status(400).send({ error: 'Invalid or empty listCart' });
  }

  console.log('listCart:', listCart);

  const line_items = listCart.map((item) => {
    // Convert priceResult to xu (cents for VND)
    // const unitAmountInXu = item.priceResult * 100;
    return {
      price_data: {
        currency: 'vnd',
        product_data: {
          name: item.name,
          images: [item.avatar],
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.priceResult,
      },
      quantity: item.quantityCurrent,
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:13000/Shop/payment-success',
      cancel_url: 'http://localhost:13000/Shop',
    });

    res.send({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }

  // const session = await stripe.checkout.sessions.create({
  //   line_items,
  //   mode: 'payment',
  //   success_url: 'http://localhost:13000/Shop',
  //   cancel_url: 'http://localhost:13000',
  // });

  // res.send({ url: session.url });
});

module.exports = router;
