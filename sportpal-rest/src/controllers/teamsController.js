import teamsService from '../services/teamsService.js'
import userService from '../services/userService.js'
import chatService from '../services/chatService.js';

const getAllTeams = async (req, res) => {
    try {
        const filters = req.query;
        const teams = await teamsService.getAllTeams(filters);
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const buscarEquipos = async (req, res) => {
    try {
        const { name } = req.query;
        const teams = await teamsService.buscarEquipos( name );
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createTeam = async (req, res) => {
    try {
        const teamData = req.body;
        req.body.owner = req.user._id;
        req.body.elo = await userService.getEloSport(req.user._id, req.body.sport);
        req.body.players = [req.user._id];
        req.body.requests = [];
        req.body.events = [];
        const user = await userService.getUserById(req.user._id);
        const team = await teamsService.createTeam(teamData);
        user.teams.push(team._id);
        await chatService.createTeamChat(team._id, [req.user._id]);
        await user.save();
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTeamById = async (req, res) => { 
    try {
        const team = await teamsService.getTeamById(req.params.id);
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const solictarIngreso = async (req, res) => {
    try {
        const team = await teamsService.solicitarIngreso(req.params.id, req.user._id);
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export default {
    getAllTeams,
    createTeam,
    getTeamById,
    solictarIngreso,
    buscarEquipos
}