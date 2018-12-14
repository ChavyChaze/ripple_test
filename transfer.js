const { RippleAPI } = require('ripple-lib');
const assert = require('assert');

assert.ok(process.env.RIPPLE_FROM_ADDRESS, 'Please specify a RIPPLE_FROM_ADDRESS');
assert.ok(process.env.RIPPLE_TO_ADDRESS, 'Please specify a RIPPLE_TO_ADDRESS');
assert.ok(process.env.RIPPLE_FROM_SECRET, 'Please specify a RIPPLE_FROM_SECRET');

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // XRP Test Net
});

run().catch(error => console.error(error.stack));

async function run() {
  await api.connect();

  // Ripple payments are represented as JavaScript objects
  const payment = {
    source: {
      address: process.env.RIPPLE_FROM_ADDRESS,
      maxAmount: {
        value: '10.00',
        currency: 'XRP'
      }
    },
    destination: {
      address: process.env.RIPPLE_TO_ADDRESS,
      amount: {
        value: '10.00',
        currency: 'XRP'
      }
    }
  };

  // Get ready to submit the payment
  const prepared = await api.preparePayment(process.env.RIPPLE_FROM_ADDRESS, payment, {
    maxLedgerVersionOffset: 5
  });
  // Sign the payment using the sender's secret
  const { signedTransaction } = api.sign(prepared.txJSON, process.env.RIPPLE_FROM_SECRET);
  console.log('Signed', signedTransaction)

  // Submit the payment
  const res = await api.submit(signedTransaction);

  console.log('Done', res);
  process.exit(0);
}