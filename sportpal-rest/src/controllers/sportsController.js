import sportService from '../services/sportService.js';

const getAllSports = async (req, res) => {
    try {
      const filters = req.query;
      const sports = await sportService.getAllSports(filters);
      res.json(sports);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

const getSportById = async (req, res) => {
    try {
      const { id } = req.params;
      const sport = await sportService.getSportById(id);
      res.json(sport);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

export default {
    getAllSports,
    getSportById
}