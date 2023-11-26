const stripe = require('stripe')('sk_test_51OGS1EKVFUQAyuHtG0jN0frrZHoHb7XwIBZIYLjSty9kYngBbYiGPc3ld2rDLak07b9QzRAelNunVzn85DxcJ2Tm00L60yD9fI');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json())


process.on('uncaughtException', function (err) {
  console.log(err);
});

app.get('/',(req, res)=>{
    res.send("Hello Folks..!!! Please subscribe my channel")
})


app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.

    const {amount, currency} = req.body

    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2022-08-01'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      payment_method_types: [ 'card'],
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  });

app.listen(4002, ()=> console.log("Running on http://localhost:4002"))