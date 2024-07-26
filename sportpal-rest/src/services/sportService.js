import Sport from '../models/sport.js';

const getAllSports = async (filters) => {
    return await Sport.find(filters);
}

const getSportById = async (id) => {
    return await Sport.findById(id);
}

export default{
    getAllSports,
    getSportById
}