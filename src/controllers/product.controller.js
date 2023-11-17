import axios from 'axios';
import Product from '../models/Product.js';
import goatApi from '../utils/goatApi.js';
import stockXApi from '../utils/stockXApi.js';

export const getProducts = async (req, res) => {
  try {
    const { limit = 0, page = 0, queryText } = req.query;
    
    const query = {
      $or: [
        { sku: { $regex: queryText, $options: 'i' } }, // 'i' para hacer la búsqueda insensible a mayúsculas y minúsculas
        { brand: { $regex: queryText, $options: 'i' } },
        { model: { $regex: queryText, $options: 'i' } },
        { colorway: { $regex: queryText, $options: 'i' } }
      ]
    };

    const [ total, data ] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .skip(Number(limit * (page - 1) ))
        .limit(Number(limit))
        .sort({colorway: 'desc'})
    ]);

    if(total > 0)
      return res.status(200).json({
        total,
        data
      });
    
    // Hacer Peticion a Goat
    const { results: goatData } = await searchOnGoat(queryText.replaceAll(' ', '%20'));

    const results = [];
    for (const goatResult of goatData) {
      const { data: { id: idGoat, sku, slug, image_url, product_type, release_date, retail_price_cents } } = goatResult;
      const { secondaryTitle, brand, urlKey, model, styleId } = await searchOnStockxWithSKU(sku.replaceAll(' ', '-'));
      if(sku === styleId) {
        const newProduct = new Product({
          type: product_type,
          sku,
          brand,
          model,
          colorway: secondaryTitle,
          mainImage: image_url,
          releaseDate: release_date,
          retailPrice: Number(retail_price_cents/100),
          stockX: {
            id: urlKey,
            endpoint: urlKey,
            baseUrl: 'https://stockx.com/'
          },
          goat: {
            id: idGoat,
            endpoint: slug,
            baseUrl: 'https://www.goat.com/sneakers/'
          }
        });
        results.push(newProduct);
      } 
    }

    const savedData = [];

    for (const product of results) {
      const savedProduct = await product.save();
      savedData.push(savedProduct);
    }

    return res.status(200).json(savedData)
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const searchOnGoat = async (query) => {
  try {
    const { data } = await goatApi.get(
      `/${query}?c=ciojs-client-2.35.2&key=key_XT7bjdbvjgECO5d8&page=1&num_results_per_page=24&sort_by=relevance&sort_order=descending`
    );
    const { response: results } = data;
    return results;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const searchOnStockxWithSKU = async (sku) => {
  try {
    const { data } = await stockXApi.post(
      '',
      {
        'query': 'query GetSearchResults($countryCode: String!, $currencyCode: CurrencyCode!, $filtersVersion: Int, $page: BrowsePageInput, $query: String!, $sort: BrowseSortInput, $staticRanking: BrowseExperimentStaticRankingInput, $list: String, $skipVariants: Boolean!) {\n  browse(\n    query: $query\n    page: $page\n    sort: $sort\n    filtersVersion: $filtersVersion\n    experiments: {staticRanking: $staticRanking}\n  ) {\n    categories {\n      id\n      name\n      count\n    }\n    results {\n      edges {\n        objectId\n        node {\n          ... on Product {\n            id\n            listingType\n            urlKey\n            primaryTitle\n            secondaryTitle\n            media {\n              thumbUrl\n            }\n            brand\n            productCategory\n            market(currencyCode: $currencyCode) {\n              state(country: $countryCode) {\n                numberOfCustodialAsks\n                lowestCustodialAsk {\n                  amount\n                }\n              }\n            }\n            favorite(list: $list)\n            variants @skip(if: $skipVariants) {\n              id\n            }\n          }\n          ... on Variant {\n            id\n            product {\n              id\n              listingType\n              urlKey\n              primaryTitle\n              secondaryTitle\n              media {\n                thumbUrl\n              }\n              brand\n              productCategory\n            }\n            market(currencyCode: $currencyCode) {\n              state(country: $countryCode) {\n                numberOfCustodialAsks\n                lowestCustodialAsk {\n                  amount\n                }\n              }\n            }\n          }\n        }\n      }\n      pageInfo {\n        limit\n        page\n        pageCount\n        queryId\n        queryIndex\n        total\n      }\n    }\n    sort {\n      id\n      order\n    }\n  }\n}',
        'variables': {
          'countryCode': 'US',
          'currencyCode': 'USD',
          'filtersVersion': 4,
          'query': sku,
          'sort': {
            'id': 'featured',
            'order': 'DESC'
          },
          'staticRanking': {
            'enabled': false
          },
          'skipVariants': true,
          'page': {
            'index': 1,
            'limit': 10
          }
        },
        'operationName': 'GetSearchResults'
      },
    );

    const { data: { browse: { results: { edges }}} } = data;

    const products = [];
    for (const element of edges) {
      const { node: { urlKey }} = element;
  
      const { data } = await stockXApi.post(
        '',
        {
          'query': 'query GetProduct($id: String!, $currencyCode: CurrencyCode, $countryCode: String!, $marketName: String, $skipBadges: Boolean!, $skipSeo: Boolean!, $skipMerchandising: Boolean!) {\n  product(id: $id) {\n    id\n    listingType\n    deleted\n    gender\n    browseVerticals\n    ...ProductMerchandisingFragment\n    ...BreadcrumbsFragment\n    ...BreadcrumbSchemaFragment\n    ...HazmatWarningFragment\n    ...HeaderFragment\n    ...NFTHeaderFragment\n    ...UrgencyBadgeFragment\n    ...MarketActivityFragment\n    ...MediaFragment\n    ...MyPositionFragment\n    ...ProductDetailsFragment\n    ...ProductMetaTagsFragment\n    ...ProductSchemaFragment\n    ...ScreenTrackerFragment\n    ...SizeSelectorWrapperFragment\n    ...StatsForNerdsFragment\n    ...ThreeSixtyImageFragment\n    ...TrackingFragment\n    ...UtilityGroupFragment\n    ...FavoriteProductFragment\n    ...ProductBadgeFragment\n  }\n}\n\nfragment ProductMerchandisingFragment on Product {\n  id\n  merchandising @skip(if: $skipMerchandising) {\n    title\n    subtitle\n    image {\n      alt\n      url\n    }\n    body\n    trackingEvent\n    link {\n      title\n      url\n      urlType\n    }\n  }\n}\n\nfragment BreadcrumbsFragment on Product {\n  breadcrumbs {\n    name\n    url\n    level\n  }\n}\n\nfragment BreadcrumbSchemaFragment on Product {\n  breadcrumbs {\n    name\n    url\n  }\n}\n\nfragment HazmatWarningFragment on Product {\n  id\n  hazardousMaterial {\n    lithiumIonBucket\n  }\n}\n\nfragment HeaderFragment on Product {\n  primaryTitle\n  secondaryTitle\n  condition\n  productCategory\n}\n\nfragment NFTHeaderFragment on Product {\n  primaryTitle\n  secondaryTitle\n  productCategory\n  editionType\n}\n\nfragment UrgencyBadgeFragment on Product {\n  id\n  productCategory\n  primaryCategory\n  sizeDescriptor\n  listingType\n  market(currencyCode: $currencyCode) {\n    ...LowInventoryBannerMarket\n  }\n  variants {\n    id\n    market(currencyCode: $currencyCode) {\n      ...LowInventoryBannerMarket\n    }\n  }\n  traits {\n    name\n    value\n    visible\n  }\n}\n\nfragment LowInventoryBannerMarket on Market {\n  bidAskData(country: $countryCode, market: $marketName) {\n    numberOfAsks\n    lowestAsk\n  }\n  salesInformation {\n    lastSale\n    salesLast72Hours\n  }\n}\n\nfragment MarketActivityFragment on Product {\n  id\n  title\n  productCategory\n  primaryTitle\n  secondaryTitle\n  media {\n    smallImageUrl\n  }\n}\n\nfragment MediaFragment on Product {\n  id\n  productCategory\n  title\n  brand\n  urlKey\n  variants {\n    id\n    hidden\n    traits {\n      size\n    }\n  }\n  media {\n    gallery\n    imageUrl\n  }\n}\n\nfragment MyPositionFragment on Product {\n  id\n  urlKey\n}\n\nfragment ProductDetailsFragment on Product {\n  id\n  title\n  productCategory\n  contentGroup\n  browseVerticals\n  description\n  gender\n  traits {\n    name\n    value\n    visible\n    format\n  }\n}\n\nfragment ProductMetaTagsFragment on Product {\n  id\n  urlKey\n  productCategory\n  brand\n  model\n  title\n  description\n  condition\n  styleId\n  breadcrumbs {\n    name\n    url\n  }\n  traits {\n    name\n    value\n  }\n  media {\n    thumbUrl\n    imageUrl\n  }\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      lowestAsk\n      numberOfAsks\n    }\n  }\n  variants {\n    id\n    hidden\n    traits {\n      size\n    }\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        lowestAsk\n      }\n    }\n  }\n  seo @skip(if: $skipSeo) {\n    meta {\n      name\n      value\n    }\n  }\n}\n\nfragment ProductSchemaFragment on Product {\n  id\n  urlKey\n  productCategory\n  brand\n  model\n  title\n  description\n  condition\n  styleId\n  traits {\n    name\n    value\n  }\n  media {\n    thumbUrl\n    imageUrl\n  }\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      lowestAsk\n      numberOfAsks\n    }\n  }\n  variants {\n    id\n    hidden\n    traits {\n      size\n    }\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        lowestAsk\n      }\n    }\n    gtins {\n      type\n      identifier\n    }\n  }\n}\n\nfragment ScreenTrackerFragment on Product {\n  id\n  brand\n  productCategory\n  primaryCategory\n  title\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      highestBid\n      lowestAsk\n      numberOfAsks\n      numberOfBids\n    }\n    salesInformation {\n      lastSale\n    }\n  }\n  media {\n    imageUrl\n  }\n  traits {\n    name\n    value\n  }\n  variants {\n    id\n    traits {\n      size\n    }\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        highestBid\n        lowestAsk\n        numberOfAsks\n        numberOfBids\n      }\n      salesInformation {\n        lastSale\n      }\n    }\n  }\n  tags\n}\n\nfragment SizeSelectorWrapperFragment on Product {\n  id\n  ...SizeSelectorFragment\n  ...SizeSelectorHeaderFragment\n  ...SizesFragment\n  ...SizesOptionsFragment\n  ...SizeChartFragment\n  ...SizeChartContentFragment\n  ...SizeConversionFragment\n  ...SizesAllButtonFragment\n}\n\nfragment SizeSelectorFragment on Product {\n  id\n  title\n  productCategory\n  browseVerticals\n  sizeDescriptor\n  availableSizeConversions {\n    name\n    type\n  }\n  defaultSizeConversion {\n    name\n    type\n  }\n  variants {\n    id\n    hidden\n    traits {\n      size\n    }\n    sizeChart {\n      baseSize\n      baseType\n      displayOptions {\n        size\n        type\n      }\n    }\n  }\n}\n\nfragment SizeSelectorHeaderFragment on Product {\n  sizeDescriptor\n  productCategory\n  availableSizeConversions {\n    name\n    type\n  }\n}\n\nfragment SizesFragment on Product {\n  id\n  productCategory\n  listingType\n  title\n}\n\nfragment SizesOptionsFragment on Product {\n  id\n  listingType\n  variants {\n    id\n    hidden\n    group {\n      shortCode\n    }\n    traits {\n      size\n    }\n    sizeChart {\n      baseSize\n      baseType\n      displayOptions {\n        size\n        type\n      }\n    }\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        lowestAsk\n      }\n      state(country: $countryCode) {\n        numberOfCustodialAsks\n        lowestCustodialAsk {\n          amount\n        }\n      }\n    }\n  }\n}\n\nfragment SizeChartFragment on Product {\n  availableSizeConversions {\n    name\n    type\n  }\n  defaultSizeConversion {\n    name\n    type\n  }\n}\n\nfragment SizeChartContentFragment on Product {\n  availableSizeConversions {\n    name\n    type\n  }\n  defaultSizeConversion {\n    name\n    type\n  }\n  variants {\n    id\n    sizeChart {\n      baseSize\n      baseType\n      displayOptions {\n        size\n        type\n      }\n    }\n  }\n}\n\nfragment SizeConversionFragment on Product {\n  productCategory\n  browseVerticals\n  sizeDescriptor\n  availableSizeConversions {\n    name\n    type\n  }\n  defaultSizeConversion {\n    name\n    type\n  }\n}\n\nfragment SizesAllButtonFragment on Product {\n  id\n  sizeAllDescriptor\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      lowestAsk\n    }\n    state(country: $countryCode) {\n      numberOfCustodialAsks\n      lowestCustodialAsk {\n        amount\n      }\n    }\n  }\n}\n\nfragment StatsForNerdsFragment on Product {\n  id\n  title\n  productCategory\n  sizeDescriptor\n  urlKey\n}\n\nfragment ThreeSixtyImageFragment on Product {\n  id\n  title\n  variants {\n    id\n  }\n  productCategory\n  media {\n    all360Images\n  }\n}\n\nfragment TrackingFragment on Product {\n  id\n  productCategory\n  primaryCategory\n  brand\n  title\n  market(currencyCode: $currencyCode) {\n    bidAskData(country: $countryCode, market: $marketName) {\n      highestBid\n      lowestAsk\n    }\n  }\n  variants {\n    id\n    market(currencyCode: $currencyCode) {\n      bidAskData(country: $countryCode, market: $marketName) {\n        highestBid\n        lowestAsk\n      }\n    }\n  }\n}\n\nfragment UtilityGroupFragment on Product {\n  id\n  ...PortfolioFragment\n  ...PortfolioContentFragment\n  ...ShareFragment\n}\n\nfragment PortfolioFragment on Product {\n  id\n  title\n  productCategory\n  variants {\n    id\n  }\n  traits {\n    name\n    value\n  }\n}\n\nfragment PortfolioContentFragment on Product {\n  id\n  productCategory\n  sizeDescriptor\n  variants {\n    id\n    traits {\n      size\n    }\n  }\n}\n\nfragment ShareFragment on Product {\n  id\n  productCategory\n  title\n  media {\n    imageUrl\n  }\n}\n\nfragment FavoriteProductFragment on Product {\n  favorite\n}\n\nfragment ProductBadgeFragment on Product {\n  badges(currencyCode: $currencyCode, market: $marketName, version: 2) @skip(if: $skipBadges) {\n    badgeID\n    title\n    subtitle\n    context {\n      key\n      value\n      format\n    }\n    backgroundColor\n    borderColor\n    icon {\n      url\n      alt\n    }\n    trackingEvent\n  }\n  variants {\n    badges(currencyCode: $currencyCode, market: $marketName, version: 2) @skip(if: $skipBadges) {\n      badgeID\n      title\n      subtitle\n      context {\n        key\n        value\n        format\n      }\n      backgroundColor\n      borderColor\n      icon {\n        url\n        alt\n      }\n      trackingEvent\n    }\n  }\n}',
          'variables': {
            'id': urlKey,
            'currencyCode': 'USD',
            'countryCode': 'US',
            'marketName': 'US',
            'skipBadges': true,
            'skipSeo': true,
            'skipMerchandising': true
          },
          'operationName': 'GetProduct'
        }
      )
  
      const { data: { product } } = data;
      products.push(product); 
    }
    return products.find(e => e.style === sku);
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const updateProductById = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body
    );

    if(!updatedProduct)
      return res.status(404).json({ message: 'Error. Product not found.' });

    return res.status(200).json({ message: 'Product has been updated successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const deleteProductById = async (req, res) => {
  try {
    await Product.findByIdAndDelete(
      req.params.productId
    );

    return res.status(200).json({ message: 'Product has been deleted successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}