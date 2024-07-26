import Team from "../models/teams.js";
import chatService from "./chatService.js";
import userService from "./userService.js";

const getAllTeams = async (filters) => {
    return await Team.find(filters);
}

const createTeam = async (teamData) => {
    return await Team.create(teamData);
}

const getTeamById = async (id) => {
    return await Team.findById(id);
}

const updateTeam = async (id, updateData) => {
    return await Team.findByIdAndUpdate
}

const calcularEloEquipo = async (teamId) => {
    const team = await Team.findById(teamId).populate({
      path: 'players',
      model: 'User'
    });

    if (!team || !team.players.length) {
      throw new Error('Equipo no encontrado o sin jugadores');
    }
  
    const deporteId = team.sport.toString(); // Asumiendo que `sport` es un ObjectId en el modelo de equipo
    let sumaElo = 0;
    let contadorJugadores = 0;
  
    for (const jugador of team.players) {
      // Encuentra el Elo del jugador para el deporte específico
      const eloJugador = jugador.elo.find(e => e.sport.toString() === deporteId);
      if (eloJugador) {
        sumaElo += eloJugador.elo;
        contadorJugadores++;
      }
    }

    if (contadorJugadores === 0) {
      return 0; // Retorna 0 si ningún jugador tiene Elo para ese deporte
    }
  
    return sumaElo / contadorJugadores; // Retorna el promedio de Elo
  };


const solicitarIngreso = async (teamId, userId) => {
    const team = await Team.findById(teamId)
    try{
        if (team.players.find(player => player._id == userId)) {
            throw new Error('Ya eres miembro de este equipo');
        } 
        
        team.players.push(userId);
        const user = await userService.getUserById(userId.toString());
        user.teams.push(teamId);
        await chatService.addParticipants(team._id, [userId]);
        await user.save();
        team.elo = await calcularEloEquipo(teamId);
        return await team.save();
    } catch (error) {
        throw new Error('Error al solicitar ingreso');
    }
    
}

const buscarEquipos = async (name) => {
    return await Team.find({name: { $regex: `.*${name}.*`, $options: 'i' }});
}


export default {
    getAllTeams,
    createTeam,
    getTeamById,
    updateTeam,
    solicitarIngreso,
    buscarEquipos
}