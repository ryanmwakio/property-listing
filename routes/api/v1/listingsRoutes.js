var express = require('express');
var router = express.Router();
var middleware = require('../../../middlewares/middleware');

var listingsController = require('../../../controllers/v1/listingsController');

/***********************************************************/
/************* GENERAL ROUTES *****************************/
/***********************************************************/

// Create a new listing
router.post(
  '/listings',
  middleware.isUserLoggedIn,
  middleware.isUserAgentOrLandloardOrSuperOrAdmin,
  listingsController.postCreateListing
);

// Get all listings
router.get('/listings', listingsController.getAllListings);

// Get a listing by id
router.get('/listings/:id', listingsController.getListingById);

// Get a specific number of listings
router.get(
  '/listings/count/get-by-count',
  listingsController.getListingsByCount
); // query

// Get a specific number of listings paginated
router.get('/listings/paginate/all', listingsController.paginateListings); // paginated

// Update a listing by id
router.put(
  '/listings/:id',
  middleware.isUserLoggedIn,
  listingsController.updateListing
);

// Delete a listing by id
router.delete(
  '/listings/:id',
  middleware.isUserLoggedIn,
  listingsController.deleteListing
);

// Get all featured listings
router.get('/listings/featured/all', listingsController.getFeaturedListings);

// Get listings by lowest price first paginated
router.get(
  '/listings/lowest-price/all',
  listingsController.paginateByLowestPrice
); // paginated

// Get listings by highest price first paginated
router.get(
  '/listings/highest-price/all',
  listingsController.paginateByHighestPriceFirst
); // paginated

// Get listings between a price range paginated
router.get('/listings/price-range/all', listingsController.filterByPriceRange); // paginated

// Get listings by number of bedrooms from smallest paginated
router.get('/listings/bedrooms-asc/all', listingsController.paginateByBedrooms); // paginated

// Get listings by county
router.get('/listings/county/all', listingsController.filterByCounty); // query

// Get listings by price range, location and county
router.get(
  '/listings/combination-filters/all',
  listingsController.filterByCombinationOfFilters
); // paginated, query

// Get listings by forRent
router.get('/listings/for-rent/all', listingsController.filterByForRent);

// Get listings for rent by price range
router.get(
  '/listings/for-rent-price-range/all',
  listingsController.filterByForRentAndPriceRange
); // query

// Get listings for sale
router.get('/listings/for-sale/all', listingsController.filterByForSale);

// Get listings that are featured, get only the number specified
router.get('/listings/featured/count', listingsController.getFeaturedByCount); // query

// Get listings that have highest views paginated
router.get(
  '/listings/most-popular/all',
  listingsController.filterByMostViewsPaginated
);

// Update list to featured by id
router.put(
  '/listings/make-featured/:id',
  middleware.isUserLoggedIn,
  middleware.isUserAdminOrSuper,
  listingsController.makeFeatured
);

// Update list to not featured by id
router.put(
  '/listings/remove-featured/:id',
  middleware.isUserLoggedIn,
  listingsController.removeFeatured
);

// update listing make it published
router.put(
  '/listings/make-published/:id',
  middleware.isUserLoggedIn,
  listingsController.makePublished
);

// update listing make it unpublished
router.put(
  '/listings/make-unpublished/:id',
  listingsController.makeUnpublished
);

// update listing make it verified
router.put(
  '/listings/make-verified/:id',
  middleware.isUserLoggedIn,
  middleware.isUserAdminOrSuper,
  listingsController.makeVerified
);

// add a review to a listing
router.post(
  '/listings/reviews/:id/add',
  middleware.isUserLoggedIn,
  listingsController.addReview
);

// get all reviews for a listing
router.get(
  '/listings/reviews/:id/all',
  middleware.isUserLoggedIn,
  listingsController.getAllReviews
);

// remove a review from a listing
router.delete(
  '/listings/reviews/:id/remove',
  middleware.isUserLoggedIn,
  listingsController.removeReview
);

// search for a listing
router.get('/search/listings', listingsController.filterByTextFromInput);

/***********************************************************/
/************* ALL ENCOMPASSING FILTER *****************************/
/***********************************************************/
router.get('/listings/filter/all', listingsController.filterByAllFilters); // query

/***********************************************************/
/************* HOUSE ROUTES *****************************/
/***********************************************************/

// Get  houses forRent paginated
router.get('/houses/for-rent', listingsController.paginateByHouseForRent); // paginated

// Get houses for sale paginated
router.get('/houses/for-sale', listingsController.paginatebyHouseForSale); // paginated

// Get houses for rent by price range paginated
router.get(
  '/houses/rent/price-range',
  listingsController.filterByHouseForRentAndPriceRangePaginated
); // query

// Get houses for sale by price range paginated
router.get(
  '/houses/sale/price-range',
  listingsController.filterByHouseForSaleAndPriceRangePaginated
); // query

// Get houses by number of bedrooms
router.get(
  '/houses/bedrooms',
  listingsController.filterByHouseBedroomsPaginated
); // query

// Get houses by county
router.get('/houses/county', listingsController.filterByHouseCountyPaginated); // query

// Get houses by location
router.get(
  '/houses/location',
  listingsController.filterByHouseLocationPaginated
); // query

// Get houses by price range, location and county
router.get(
  '/houses/combination-filters',
  listingsController.filterByCombinationOfHouseFiltersPaginated
); // paginated, query

/***********************************************************/
/************* APARTMENT ROUTES *****************************/
/***********************************************************/

// Get aprtments forRent paginated
router.get(
  '/apartments/for-rent',
  listingsController.paginateByApartmentForRent
); // paginated

// Get houses for sale paginated
router.get(
  '/apartments/for-sale',
  listingsController.paginatebyapartmentForSale
); // paginated

// Get apartments for rent by price range paginated
router.get(
  '/apartments/rent/price-range',
  listingsController.filterByapartmentForRentAndPriceRangePaginated
); // query

// Get apartments for sale by price range paginated
router.get(
  '/apartments/sale/price-range',
  listingsController.filterByapartmentForSaleAndPriceRangePaginated
); // query

// Get apartments by number of bedrooms
router.get(
  '/apartments/bedrooms',
  listingsController.filterByapartmentBedroomsPaginated
); // query

// Get apartments by county
router.get(
  '/apartments/county',
  listingsController.filterByapartmentCountyPaginated
); // query

// Get apartments by location
router.get(
  '/apartments/location',
  listingsController.filterByapartmentLocationPaginated
); // query

// Get apartments by price range, location and county
router.get(
  '/apartments/combination-filters',
  listingsController.filterByCombinationOfapartmentFiltersPaginated
); // paginated, query

/***********************************************************/
/************* LAND ROUTES *****************************/
/***********************************************************/

// Get lands forRent paginated
router.get('/lands/for-rent', listingsController.paginateBylandForRent); // paginated

// Get houses for sale paginated
router.get('/lands/for-sale', listingsController.paginatebylandForSale); // paginated

// Get lands for rent by price range paginated
router.get(
  '/lands/rent/price-range',
  listingsController.filterBylandForRentAndPriceRangePaginated
); // query

// Get lands for sale by price range paginated
router.get(
  '/lands/sale/price-range',
  listingsController.filterBylandForSaleAndPriceRangePaginated
); // query

// Get lands by county
router.get('/lands/county', listingsController.filterBylandCountyPaginated); // query

// Get lands by location
router.get('/lands/location', listingsController.filterBylandLocationPaginated); // query

// Get lands by price range, location and county
router.get(
  '/lands/combination-filters',
  listingsController.filterByCombinationOflandFiltersPaginated
); // paginated, query

/***********************************************************/
/************* WAREHOUSE ROUTES *****************************/
/***********************************************************/

// Get warehouses forRent paginated
router.get(
  '/warehouses/for-rent',
  listingsController.paginateByWarehouseForRent
); // paginated

// Get houses for sale paginated
router.get(
  '/warehouses/for-sale',
  listingsController.paginatebyWarehouseForSale
); // paginated

// Get warehouses for rent by price range paginated
router.get('/warehouses/county', listingsController.filterByWarehouseCounty); // query

// Get warehouses by location paginated
router.get(
  '/warehouses/location',
  listingsController.filterByWarehouseLocation
); // query

// Get warehouses by price range
router.get(
  '/warehouses/price-range',
  listingsController.filterByWarehousePriceRange
); // query

// Get warehouses by county
router.get(
  '/warehouses/combination-filters',
  listingsController.filterByCombinationOfWarehouseFilters
); // paginated, query

/***********************************************************/
/************* COMMERCIAL PROPERTY ROUTES *****************************/
/***********************************************************/

// Get commercial-property forRent paginated
router.get(
  '/commercial-property/for-rent',
  listingsController.paginateByCommercialPropertyForRent
); // paginated

// Get commercial-property for sale paginated
router.get(
  '/commercial-property/for-sale',
  listingsController.paginatebyCommercialPropertyForSale
); // paginated

// Get commercial-property for rent by price range paginated
router.get(
  '/commercial-property/rent/price-range',
  listingsController.filterByCommercialPropertyForRentAndPriceRangePaginated
); // query

// Get commercial-property for sale by price range paginated
router.get(
  '/commercial-property/sale/price-range',
  listingsController.filterByCommercialPropertyForSaleAndPriceRangePaginated
); // query

// Get commercial-property by county
router.get(
  '/commercial-property/county',
  listingsController.filterByCommercialPropertyCountyPaginated
); // query

// Get commercial-property by location
router.get(
  '/commercial-property/location',
  listingsController.filterByCommercialPropertyLocationPaginated
); // query

// Get commercial-property by price range, location and county
router.get(
  '/commercial-property/combination-filters',
  listingsController.filterByCombinationOfCommercialPropertyFiltersPaginated
); // paginated, query

module.exports = router;
