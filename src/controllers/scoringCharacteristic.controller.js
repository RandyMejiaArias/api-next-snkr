import ScoringCharacteristic from '../models/ScoringCharacteristic.js';

export const createScoringCharacteristic = async (req, res) => {
  try {
    const { name } = req.body;

    const scoringCharacteristicFound = await ScoringCharacteristic.find({name});

    if(scoringCharacteristicFound)
      return res.status(400).json({
    message: 'Scoring characteristic already exists.' });

    const scoringCharacteristic = new ScoringCharacteristic({ name });

    const savedScoringCharacteristic = await scoringCharacteristic.save();

    return res.status(201).json({
      message: 'Scoring characteristic saved successfully!',
      data: savedScoringCharacteristic
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getScoringCharacteristics = async (req, res) => {
  try {
    const [ scoringCharacteristics, total ] = await Promise.all([
      ScoringCharacteristic.find(),
      ScoringCharacteristic.countDocuments()
    ]);

    return res.status(200).json({
      data: scoringCharacteristics,
      total
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getScoringCharacteristicById = async (req, res) => {
  try {
    const { scoringCharacteristicId } = req.params;

    const scoringCharacteristicFound = await ScoringCharacteristic.findById(scoringCharacteristicId);

    if(!scoringCharacteristicFound)
      return res.status(404).json({ message: 'Scoring characteristic not found.' });

    return res.status(200).json({ data: scoringCharacteristicFound });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const updateScoringCharacteristicById = async (req, res) => {
  try {
    const updatedScoringCharacteristic = await ScoringCharacteristic.findByIdAndUpdate(
      req.params.scoringCharacteristicId,
      req.body
    );

    if(!updatedScoringCharacteristic)
      return res.status(404).json({ message: 'Error. Scoring characteristic not found.' });

    return res.status(200).json({ message: 'Scoring characteristic has been updated successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const deleteScoringCharacteristicById = async (req, res) => {
  try {
    await ScoringCharacteristic.findByIdAndDelete(
      req.params.scoringCharacteristicId
    );

    return res.status(200).json({ message: 'Scoring characteristic has been deleted successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}