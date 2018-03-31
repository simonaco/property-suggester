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
      order_by: body.order_by,
      maximum_price: body.maximum_price,
      minimum_beds: body.minimum_beds,
      page_size: 100,
      page_number: 1
    },
    method: 'GET'
  };
  request(options, (err, result) => {
    if (err) {
      context.log(`Error: ${err}`);
      context.done();
      return;
    } else {
      const listings = JSON.parse(result.body);
      context.log(`Found ${listings.result_count}`);
      let filteredListings = filterData(JSON.parse(result.body));
      filteredListings = _.without(filteredListings, undefined);
      context.done(null, {
        res: {
          listings: {
            initial_count: listings.result_count,
            filteredCount: filteredListings.length,
            apartments: filteredListings
          }
        }
      });
    }
  });
};

const filterData = listings => {
  return _.map(listings.listing, listing => {
    const rental_prices = listing.rental_prices;
    if (rental_prices.shared_occupancy === 'N') return listing;
  });
};
