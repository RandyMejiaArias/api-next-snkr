import Size from '../models/Size.js';
import Product from '../models/Product.js';

export const createSize = async (req, res) => {
  try {
    const { number, referencedProduct, stockXPrice, goatPrice } = req.body;

    const productFound = await Product.findById(referencedProduct);

    if(!productFound)
      return res.status(404).json({ message: 'Error. Product not exists.' });

    const sizeFound = await Size.findOne({
      referencedProduct,
      number
    });

    if(sizeFound)
      return res.status(404).json({ message: 'Error. Size already exists' });

    const newSize = newSize({
      number,
      lastRevisionDate: Date.now(),
      referencedProduct,
      stockXPrice,
      goatPrice
    })

    const savedSize = await newSize.save();

    return res.status(201).json({
      message: 'Size created successfully.',
      data: savedSize
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const getSizesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const productFound = await Product.findById(productId);
    if(!productFound)
      return res.status(404).json({ message: 'Error. Product not exists.' });

    const [ total, data ] = await Promise.all([
      Size.countDocuments({ referencedProduct: productId }),
      Size.find({ referencedProduct: productId })
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

export const getSizeByProductAndNumber = async (req, res) => {
  try {
    const { productId } = req.params;
    const { number } = req.body;

    const productFound = await Product.findById(productId);
    if(!productFound)
      return res.status(404).json({ message: 'Error. Product not exists.' });

    const sizeFound = await Size.find({
      referencedProduct: productId,
      number
    });

    return res.status(200).json(sizeFound);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const getSizeById = async (req, res) => {
  try {
    const { sizeId } = req.params;
    const sizeFound = await Size.findById(sizeId);
    if(!sizeFound)
      return res.status(404).json({ message: 'Size not found.' });

    return res.status(200).json(sizeFound);
  } catch (error) {
      return res.status(500).json(error);
  }
}

export const updateSizeById = async (req, res) => {
  try {
    const updatedSize = await Size.findByIdAndUpdate(
      req.params.sizeId,
      req.body
    );

    if(!updatedSize)
      return res.status(404).json({ message: 'Error. Size not exists.' });

    return res.status(200).json({ message: 'Size has been updated successfully.' })
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const updatePriceOnSize = async (req, res) => {
  try {
    const { sizeId } = req.params;
    
    const sizeFound = await Size.findById(sizeId);
    if(!sizeFound)
      return res.status(404).json({ message: 'Size not found.' });
    
    sizeFound.lastRevisionDate = Date.now();
    await sizeFound.save();
    return res.status(200).json({ message: 'Size has been updated successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const deleteSizeById = async (req, res) => {
  try {
    await Size.findByIdAndDelete(req.params.sizeId);

    return res.status(200).json({ message: 'Size has been deleted successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}