/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import API from '../../api';

const client = API.instance();



const Confirm = ({ sport, eventId }) => {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')));
    const [selectedTeam, setSelectedTeam] = useState('');
    const [teams, setTeams] = useState([]);
    const [sportData, setSportData] = useState(null);

    const fetchSport = async () => {
        const sportData = await client.getSports({ _id: sport });
        console.log(sportData)
        setSportData(sportData[0]);
    };

    const fetchEquipos = async () => {
        if (sportData.team){
            const equiposData = await client.getTeams({ owner: userData._id, sport: sportData._id });
            console.log (equiposData)
            setTeams(equiposData);
        } 
    };

    fetchSport();
    fetchEquipos();


    const onConfirm = async (team) => {
        if (sportData.team) {
            if (!team) {
                alert('Selecciona un equipo');
                return;
            }
            await client.unirseEventoEquipo (eventId, team);
        } else {
            await client.unirseEventoIndividual (eventId);
        }
    };


    return (
        <div>
            <p>¿Estás seguro de que quieres realizar esta acción?</p>
            {true && (
                <div>
                    <label htmlFor="teamSelector">Selecciona tu equipo:</label>
                    <select
                        id="teamSelector"
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                    >
                        <option value="">Seleccionar equipo</option>
                        {teams.map((team) => (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <button onClick={() => onConfirm(selectedTeam)}>Confirmar</button>
    
        </div>
    );
};

export default Confirm;