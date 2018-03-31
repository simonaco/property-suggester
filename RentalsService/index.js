const request = require('request');
module.exports = function(context, req) {
  context.log('Function execution start');
  const body = req.query;

  const options = {
    url: 'https://api.zoopla.co.uk/api/v1/property_listings.js',
    qs: {
      api_key: process.env.API_KEY,
      area: body.area,
      listing_status: body.listing_status,
      order_by: body.order_by
    },
    method: 'GET'
  };
  request(options, (err, result) => {
    if (err) {
      context.log(`Error: ${err}`);
      context.done();
      return;
    } else {
      context.log(`Found ${result.body}`);
      context.done(null, { res: { listings: JSON.parse(result.body) } });
    }
  });
};
