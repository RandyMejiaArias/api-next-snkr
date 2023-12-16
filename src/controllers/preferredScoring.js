import mongoose from 'mongoose';
import PreferredScoring from '../models/PreferredScoring.js';

export const getPreferredScoringByUser = async (req, res) => {
  try {
    const referencedUser = req.userId;

    const preferredScoringFound = await PreferredScoring.findOne({ referencedUser }).populate('scoringCharacteristics.scoreCharacteristic');

    return res.status(200).json(preferredScoringFound);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const addScoreToPreferredScoring = async (req, res) => {
  try {
    const referencedUser = req.userId;
    const { scoreItems } = req.body;
    
    const preferredScoringFound = await PreferredScoring.find({ referencedUser });

    for (const item of scoreItems) {
      const scoreOnPreferredScoring = await PreferredScoring.findOne({
        'scoringCharacteristics': {
          $elemMatch: {
            scoreCharacteristic: item.scoreCharacteristic,
            score: item.score
          }
        },
        referencedUser
      });

      if(scoreOnPreferredScoring)
        return res.status(400).json({ message: 'Error. Score has already added to preferred scores.' });
    }

    if(preferredScoringFound.length > 0)
      await PreferredScoring.findByIdAndUpdate(preferredScoringFound, {
        $push: {
          'scoringCharacteristics': scoreItems
        }
      });
    else{
      const newPreferredScoring = new PreferredScoring({
        referencedUser,
        scoringCharacteristics: scoreItems
      });

      await newPreferredScoring.save();
    }

    return res.status(200).json({ message: 'Score added to preferred scoring successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);    
  }
}

export const changeScoreOfCharacteristicOnPreferredScoring = async (req, res) => {
  try {
    const { preferredScoringId } = req.params;
    const { _id, score } = req.body;

    const preferredScoringFound = await PreferredScoring.findById(preferredScoringId)

    if(!preferredScoringFound)
      return res.status(404).json({ message: 'Error. Preferred score does not exists.' });

    const { scoringCharacteristics } = preferredScoringFound;

    for (const item of scoringCharacteristics) {
      if(item._id.equals(mongoose.Types.ObjectId(_id)))
        item.score = score
    }

    await PreferredScoring.findByIdAndUpdate(preferredScoringId, { scoringCharacteristics });

    return res.status(200).json({ message: 'Score on preferred scoring updated successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);    
  }
}

