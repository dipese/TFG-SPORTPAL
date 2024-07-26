import Event from '../models/events.js';

const getAllEvents = async (filters) => {
    return await Event.find(filters);
}

const getEventById = async (id) => {
    return await Event.findById(id);
}

const createEvent = async (eventData) => {
    const newEvent = new Event(eventData);
    return await newEvent.save();
}

const updateEvent = async (id, eventData) => {
    return await Event.findByIdAndUpdate
        (id, eventData, { new: true });
}


export default {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent
}