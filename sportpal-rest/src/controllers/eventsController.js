import eventService from "../services/eventService.js"
import userService from "../services/userService.js";    
import sportService from "../services/sportService.js";
import chatService from "../services/chatService.js";

const parseFilters = (filters) => {
    Object.keys(filters).forEach(key => {
        if (filters[key] === '') {
            delete filters[key];
        }
    });
    return filters;
}

const getAllEvents = async (req, res) => {
    try {
        const filters = parseFilters(req.query);
        const events = await eventService.getAllEvents(filters);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        eventData.admin = req.user._id;
        if (eventData.teamSport == 'false'){
            eventData.participante1 = null;
            eventData.participante2 = null;
        }
        else {
            eventData.equipo1 = null;
            eventData.equipo2 = null;
        }
        const newEvent = await eventService.createEvent(eventData);
        await chatService.createEventChat(newEvent._id, [req.user._id]);
        res.json(newEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const formulaElo = (elo1, resultado, elo2) => {
    return elo1 + 32 * (resultado - 1 / (1 + 10 ** ((elo2 - elo1) / 400)));
}

const actualizarElo = async (userId, resultado, eloPropio, eloOponente, sport) => {
    const user = await userService.getUserById(userId);
    const newPuntuacion = formulaElo(eloPropio, resultado, eloOponente);
    const sportIndex = user.elo.findIndex(e => e.sport.toString() === sport.toString());
    user.elo[sportIndex].elo = newPuntuacion;
    await userService.updateUser(userId, user);
}

const finalizarEvento = async (event) => {
    const resultado = event.result.puntuacionParticipante1 > event.result.puntuacionParticipante2 ? 1 : event.result.puntuacionParticipante1 === event.result.puntuacionParticipante2 ? 0.5 : 0;
    const sport = await sportService.getSportById(event.sport);
    if (sport.team === false){
        const elo1 = await userService.getEloSport(event.participante1, event.sport);
        const elo2 = await userService.getEloSport(event.participante2, event.sport);
        await actualizarElo(event.participante1, resultado, elo1, elo2, event.sport);
        await actualizarElo(event.participante2, 1 - resultado, elo1, elo2, event.sport);
    } else {
        const elo1 = event.equipo1.elo
        const elo2 = event.equipo2.elo
        for (const jugador of event.equipo1.players){
            await actualizarElo(jugador, resultado, elo1, elo2, event.sport);
        }
        for (const jugador of event.equipo2.players){
            await actualizarElo(jugador, 1 - resultado, elo1, elo2, event.sport);
        }
    }
}

const esEventoFinalizado = (event) => {
    return event.result.puntuacionParticipante1 !== undefined && event.result.puntuacionParticipante2 !== undefined;
}

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const evento = await eventService.getEventById(id);
        const eventData = req.body;
        if (!esEventoFinalizado(evento) && evento.admin.toString() === req.user._id.toString()) {
            const updatedEvent = await eventService.updateEvent(id, eventData);
            if (esEventoFinalizado (updatedEvent)){
                await finalizarEvento(updatedEvent);
            }
            res.json(updatedEvent);
        } else {
            res.status(400).json({ message: "No puedes modificar este evento" });
        
        }

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const eventoLleno = (event) => {
    const sport = sportService.getSportById(event.sport);
    if (sport.team){
        return event.equipo1 !== null && event.equipo2 !== null;
    } else {
        return event.participante1 !== null && event.participante2 !== null;
    }
}

const getEventsAMostrar = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user._id);
        const filters = parseFilters(req.query);
        const events = await eventService.getAllEvents(filters);
        const eventsAMostrar = [];
        for (const event of events){
            if (new Date (event.date) > new Date ())
                eventsAMostrar.push(event);
            else if ((event.admin === req.user._id.toString() || user.events.includes(event._id.toString()) || user.teamEvents.includes(event._id.toString())) && eventoLleno(event))
                eventsAMostrar.push(event);
        }
        res.json(eventsAMostrar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const solicitarUnionEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await eventService.getEventById(id);
        const sport = await sportService.getSportById(event.sport);
        if (sport.team === false) {
            if (event.participante1 === null || event.participante1 === undefined) {
                event.participante1 = req.user._id;
                const user = await userService.getUserById(req.user._id.toString());
                user.events.push(id);
                await user.save();
                await chatService.addParticipants(null, id, [req.user._id]);
                await event.save();
            } else if ((event.participante2 === null || event.participante2 === undefined) && event.participante1 !== req.user._id) {
                event.participante2 = req.user._id;
                const user = await userService.getUserById(req.user._id.toString());
                user.events.push(id);
                await user.save();
                await chatService.addParticipants(null, id, [req.user._id]);
                await event.save();
            } else {
                res.status(400).json({ message: "El evento ya tiene los dos participantes" });
            }
        } else {
            if (event.equipo1 === null || event.equipo1 === undefined) {
                event.equipo1 = req.team._id;
                const team = await teamsService.getTeamById(req.team._id);
                team.events.push(id);
                for (const jugador of team.players){
                    const user = await userService.getUserById(jugador);
                    user.events.push(id);
                    await chatService.addParticipants(null, id, [jugador]);
                    await user.save();
                }
                team.save();
                event.save();
            } else if ((event.equipo2 === null || event.equipo2 === undefined) && event.equipo1 !== req.team._id) {
                event.equipo2 = req.user._id;
                const team = await teamsService.getTeamById(req.team._id);
                team.events.push(id);
                for (const jugador of team.players){
                    const user = await userService.getUserById(jugador);
                    user.events.push(id);
                    await chatService.addParticipants(null, id, [jugador]);
                    await user.save();
                }
                team.save();
                event.save();
            }
            else {
                res.status(400).json({ message: "El evento ya tiene los dos equipos" });
            }
        }
        const updatedEvent = await eventService.updateEvent(id, event);
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const solicitarUnionEventoEquipo = async (req, res) => {
    const { id, teamId } = req.params;
    const event = await eventService.getEventById(id);
    const team = await teamsService.getTeamById(teamId);
    
    if (event.equipo1 === null || event.equipo1 === undefined) {
        event.equipo1 = team._id;
        team.events.push(id);
        for (const jugador of team.players){
            const user = await userService.getUserById(jugador);
            user.events.push(id);
            await chatService.addParticipants(null, id, [jugador]);
            await user.save();
        }
        team.save();
        event.save();
    } else if ((event.equipo2 === null || event.equipo2 === undefined) && event.equipo1 !== team._id) {
        event.equipo2 = team._id;
        team.events.push(id);
        for (const jugador of team.players){
            const user = await userService.getUserById(jugador);
            user.events.push(id);
            await chatService.addParticipants(null, id, [jugador]);
            await user.save();
        }
        team.save();
        event.save();
    }
    else {
        res.status(400).json({ message: "El evento ya tiene los dos equipos" });
    }
}

export default {
    getAllEvents,
    createEvent,
    updateEvent,
    solicitarUnionEvento,
    getEventsAMostrar,
    solicitarUnionEventoEquipo
}