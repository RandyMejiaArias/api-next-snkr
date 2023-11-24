import Size from '../models/Size.js';
import Product from '../models/Product.js';
import { getGoatPrices } from './goatController.js';
import { searchOnStockxWithSKU } from './stockXController.js';

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

    const currentDate = new Date();
    const dateToCompare = new Date();
    dateToCompare.setDate(currentDate.getDate() - 7);

    const sizes = [];
    const savedSizes = [];
    if(productFound.lastRevisionDate === undefined || productFound.lastRevisionDate < dateToCompare || total === 0) {
      const goatResults = await getGoatPrices(productFound.goat.id);
      const { variants } = await searchOnStockxWithSKU(productFound.sku);

      goatResults.forEach(goatSize => {
        variants.forEach(stockXSize => {
          if(stockXSize.sizeChart.baseSize.replace(/[^\d.]/g, '') === goatSize.sizeOption.presentation && goatSize.shoeCondition === 'new_no_defects' && goatSize.boxCondition === 'good_condition')
            sizes.push({ ...goatSize, ...stockXSize })
        });
      });

      for (const size of sizes) {
        const newSize = new Size({
          number: size.sizeChart.baseSize,
          stockXPrice: size.market.bidAskData.lowestAsk.toFixed(2),
          goatPrice: (size.lowestPriceCents.amount / 100).toFixed(2),
          referencedProduct: productId
        })

        const sizeFound = await Size.findOne({
          referencedProduct: productId,
          number: size.sizeChart.baseSize
        });

        if(sizeFound) {
          const savedSize = await Size.findByIdAndUpdate(sizeFound._id, {
            goatPrice: newSize.goatPrice,
            stockXPrice: newSize.stockXPrice
          })
          savedSizes.push(savedSize);
        } else {
          const savedSize = await newSize.save();
          savedSizes.push(savedSize);
        }
      }

      await Product.findByIdAndUpdate(productId, {
        lastRevisionDate: currentDate
      })

      return res.status(200).json({
        total: savedSizes.length,
        data: savedSizes
      });
    } else {
      return res.status(200).json({
        total,
        data
      });
    }
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
    console.log(error);
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