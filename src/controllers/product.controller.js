import Product from '../models/Product.js';
import { searchOnStockxWithSKU } from './stockXController.js';
import { searchOnGoat } from './goatController.js'

export const getProducts = async (req, res) => {
  try {
    const { limit = 0, page = 0 } = req.query;

    const [ total, data ] = await Promise.all([
      Product.countDocuments(),
      Product.find()
        .skip(Number(limit * (page - 1) ))
        .limit(Number(limit))
        .sort({releaseDate: 'desc'})
    ]);

    return res.status(200).json({
      total,
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const searchProducts = async (req, res) => {
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
        .sort({releaseDate: 'desc'})
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
      const productFound = await Product.findOne({sku: sku.replaceAll(' ', '-')});
      if(!productFound) {
        const releaseDate = new Date(`${release_date?.toString().substring(0, 4)}-${release_date?.toString().substring(4, 6)}-${release_date?.toString().substring(6, 8)}`);
        const stockXData = await searchOnStockxWithSKU(sku.replaceAll(' ', '-'));
        if(stockXData) {
          const { secondaryTitle, brand, urlKey, model, styleId } = stockXData;
          if(sku.replaceAll(' ', '-') === styleId) {
            const newProduct = new Product({
              type: product_type,
              sku: styleId,
              brand,
              model,
              colorway: secondaryTitle,
              mainImage: image_url,
              releaseDate: !isNaN(releaseDate.getTime()) ? releaseDate : release_date,
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
      }
    }
    const savedData = [];
    
    for (const product of results) {
      const productFound = await Product.findOne({sku: product.sku})
      if(!productFound) {
        const savedProduct = await product.save();
        savedData.push(savedProduct);
      }
    }

    return res.status(200).json({ 
      total: savedData.length, 
      data: savedData
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const productFound = await Product.findById(productId);

    if(!productFound) return res.status(404).json({ message: 'Error. Product not found.' });

    return res.status(200).json({ data: productFound });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
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