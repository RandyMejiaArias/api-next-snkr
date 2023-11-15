import Product from '../models/Product.js';

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