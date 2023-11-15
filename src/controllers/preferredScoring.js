import PreferredScoring from '../models/PreferredScoring.js';
import ScoringCharacteristic from '../models/ScoringCharacteristic.js';

export const getPreferredScoringByUser = async (req, res) => {
  try {
    const referencedUser = req.userId;

    const preferredScoringFound = await PreferredScoring.find({ referencedUser });

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
      const [ score, scoreOnPreferredScoring ] = await Promise.all([
        ScoringCharacteristic.find(item.scoringCharacteristic),
        PreferredScoring.find({
          'scoringCharacteristics': {
            $elemMatch: {
              scoreCharacteristic: item.scoreCharacteristic,
              score: item.score
            }
          }
        })
      ]);

      if(scoreOnPreferredScoring.length > 0)
        return res.status(400).json({ message: 'Error. Score has already added to preferred scores.' });
    }

    if(preferredScoringFound)
      await PreferredScoring.findByIdAndUpdate(preferredScoringFound, {
        $push: {
          'scoreCharacteristic': scoreItems
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
    const { scoreCharacteristic, score } = req.body;

    const preferredScoringFound = await PreferredScoring.findOne({
      id: preferredScoringId,
      scoringCharacteristics: {
        $elemMatch: {
          scoreCharacteristic,
          score
        }
      }
    });

    if(!preferredScoringFound)
      return res.status(404).json({ message: 'Error. Preferred score does not exists.' });

    const { scoringCharacteristics } = preferredScoringFound;

    for (const item of scoringCharacteristics) {
      if(item.scoreCharacteristic === scoreCharacteristic)
        item.score = score
    }

    await PreferredScoring.findByIdAndUpdate(preferredScoringId, { scoringCharacteristics });

    return res.status(200).json({ message: 'Score on preferred scorng updated successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);    
  }
}

