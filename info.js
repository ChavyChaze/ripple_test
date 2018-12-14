const { RippleAPI } = require('ripple-lib');

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // XRP Test Net
});

run().catch(error => console.error(error.stack));

async function run() {
  await api.connect();
  const info = await api.getAccountInfo(process.env.RIPPLE_ADDRESS);

  console.log('Done', info);
  process.exit(0);
}
