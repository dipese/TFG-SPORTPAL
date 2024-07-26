/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import L from 'leaflet';
import API from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Modal from '../modal';
import Chat from '../../pages/chat';
import Confirm from '../confirm';

const client = API.instance()

const stringToBoolean = (str) => str === 'true';

const commonStyle = {
    padding: '10px 15px', // Ajusta el padding para que coincida con el del botón
    width: '100%', // Asegura que ocupen todo el ancho disponible
    marginBottom: '10px', // Añade un margen inferior para separar los elementos
    borderRadius: '5px', // Añade bordes redondeados
    border: '1px solid #ccc', // Define el borde
  };

  // eslint-disable-next-line react/prop-types
  const FilterMenu = ({ onApplyFilters }) => {
    const [sport, setSport] = useState('');
    const [eventName, setEventName] = useState('');
    const [sports, setSports] = useState([]);
  
    const menuStyle = {
      position: 'absolute',
      top: '10%',
      right: '10%',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      padding: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    };
  
    // Asume que buttonStyle ya está definido
    const buttonStyle = {
      ...commonStyle, // Aplica el estilo común
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
    };

    useEffect(() => {
        const fetchSports = async () => {
            const sportsData = await API.instance().getSports();
            setSports(sportsData || []);
        };

        fetchSports();
    }, []);
  
    return (
        <div style={menuStyle}>
            <div>
                <label>Deporte:</label>
                <select value={sport} onChange={(e) => setSport(e.target.value)} style={{ ...commonStyle }}>
                    <option value="seleccionar">Seleccionar Deporte</option>
                    {sports.map((sport) => (
                        <option key={sport._id} value={sport._id}>
                            {sport.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Event Name:</label>
                <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ ...commonStyle, width: '88.5%' }} />
            </div>
            <button onClick={() => onApplyFilters(sport, eventName)} style={buttonStyle}>Filtrar</button>
        </div>
    );
  };
  
  // eslint-disable-next-line react/prop-types
  const FiltersButton = ({ onClick }) => (
    <button onClick={onClick} style={{
        position: 'absolute',
        bottom: '40px', // Ajusta la distancia desde el fondo
        right: '20px', // Ajusta la distancia desde la derecha
        zIndex: 1000, // Asegura que el botón esté sobre otros elementos
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer'
      }}>
      <FontAwesomeIcon icon={faFilter} size="2x" />
    </button>
  );

// eslint-disable-next-line react/prop-types
const Map = ({ altura = '100vh', onMapClick, filtrar = false}) => {
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [clickedPosition, setClickedPosition] = useState([0, 0]);
    const [showFilters, setShowFilters] = useState(false);
    const [events, setEvents] = useState([]);
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')));
    const [isModalChatOpen, setIsModalChatOpen] = useState(false);
    const [chat , setChat] = useState([]);
    const [nombreChat, setNombreChat] = useState('');
    const [eventJoinSport, setEventJoinSport] = useState(false);
    const [eventJoinId, setEventJoinId] = useState('');
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

    const openModalChat = () => setIsModalChatOpen(true);
    const closeModalChat = () => setIsModalChatOpen(false);

    const openModalConfirm = () => setIsModalConfirmOpen(true);
    const closeModalConfirm = () => setIsModalConfirmOpen(false);

    const handleAbrirChat = async (id, nombre) => {
        const chat = await client.getChatEvent(id);
        setChat(chat[0]);
        setNombreChat('Chat con ' + nombre);
        openModalChat();
    }


    const handleApplyFilters = useCallback(async (sport, eventName) => {
        setShowFilters(false);
        const filters = {};
        if (sport !== '') {
            filters.sport = sport;
        }
        if (eventName) {
            filters.name = eventName;
        }
        console.log (filters);
        const eventos = await client.getEvents(filters);
        setEvents(eventos);
    }, []);

    const handleUnirseEvento = async (id, sport) => {
        setEventJoinSport(sport);
        setEventJoinId(id);
        openModalConfirm();
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const eventos = await client.getEventsAMostrar();
            setEvents(eventos);
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        // Create a map instance
        const map = L.map('map', {
            //center posicion del usuario
            center: [0, 0],
            zoom: 13,
            zoomControl: false 
        });    

        // Add a tile layer to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        }).addTo(map);

        L.control.zoom({
            position: 'bottomleft'
        }).addTo(map);

        // Get the current location of the user
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            // Set the center of the map to the user's location
            setMapCenter([latitude, longitude]);
            map.setView([latitude, longitude], 13);
            setClickedPosition([latitude, longitude]);

            // Add markers or other interactive elements to the map
        });

        const mostrarEventos = async () => {

            events.forEach(async (event) => {
                const { name, description, date, sport, _id } = event;
                const sportName = await client.getSportById(sport);
                const { latitude, longitude} = event.location;
                const esAdmin = userData && event.admin === userData._id;
                const introducirResultado = esAdmin && new Date (event.date) < new Date() && !event.result;
                const participa = userData && (userData.events.includes(_id) || userData.teamEvents.includes(_id));
                const participantes = [];
                let participantsContent = '<p style="margin: 10px 0;">Participante 1: LIBRE <br> Participante 2: LIBRE</p>';
                if (sportName.team) {
                    if (event.equipo1){
                        const equipo1 = await client.getTeamById(event.equipo1);
                        participantes.push (equipo1.name);
                    }
                    if (event.equipo2){
                        const equipo2 = await client.getTeamById(event.equipo2);
                        participantes.push (equipo2.name);
                    }
                } else {
                    if (event.participante1)
                        participantes.push (event.participante1)
                    if (event.participante2)
                        participantes.push (event.participante2)
                }
                if (participantes[0] && participantes[1]) {
                    participantsContent = `<p style="margin: 10px 0;">Participante 1: ${participantes[0]} <br> Participante 2: ${participantes[1]}</p>`;
                } else if (participantes[0]) {
                    participantsContent = `<p style="margin: 10px 0;">Participante 1: ${participantes[0]} <br> Participante 2: LIBRE</p>`;
                } else if (participantes[1]) {
                    participantsContent = `<p style="margin: 10px 0;">Participante 1: LIBRE <br> Participante 2: ${participantes[1]}</p>`;
                }

                    
                if (introducirResultado) {
                    const redMarker = L.icon({
                        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    const marker = L.marker([latitude, longitude], { icon: redMarker }).addTo(map);
                    marker.bindPopup(`
                        <div style="font-family: Arial, sans-serif; padding: 8px; border-radius: 8px; background: #f9f9f9; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                            <b style="font-size: 16px;">${name}</b><br>
                            <span style="color: #333;">${sportName.name}</span><br><br>
                            <p style="margin: 10px 0;">${description}</p>
                            ${participantsContent}
                            <time style="font-size: 12px; color: #666;">${new Date(date).toLocaleString()}</time><br>
                            <button id="joinEventButton-${_id}-${sportName.team}"" style="margin-top: 10px; background-color: #4CAF50; color: white; padding: 10px 24px; border: none; border-radius: 4px; cursor: pointer;">
                                Introducir resultado
                            </button>
                            <button style="margin-top: 10px; background-color: #4CAF50; color: white; padding: 10px 24px; border: none; border-radius: 4px; cursor: pointer;">
                                Chat
                            </button>
                        </div>
                    `);
                } else if (esAdmin) {
                    const greenMarker = L.icon({
                        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    const marker = L.marker([latitude, longitude], { icon: greenMarker }).addTo(map);
                    marker.bindPopup(`
                        <div style="font-family: Arial, sans-serif; padding: 8px; border-radius: 8px; background: #f9f9f9; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                            <b style="font-size: 16px;">${name}</b><br>
                            <span style="color: #333;">${sportName.name}</span><br><br>
                            <p style="margin: 10px 0;">${description}</p>
                            ${participantsContent}
                            <time style="font-size: 12px; color: #666;">${new Date(date).toLocaleString()}</time><br>
                            <button id="chat-${_id}-${name}" style="margin-top: 10px; background-color: #4CAF50; color: white; padding: 10px 24px; border: none; border-radius: 4px; cursor: pointer;">
                                Chat
                            </button>
                        </div>
                    `);
                } else if (participa) {
                    const orangeMarker = L.icon({
                        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    const marker = L.marker([latitude, longitude], { icon: orangeMarker }).addTo(map);
                    marker.bindPopup(`
                        <div style="font-family: Arial, sans-serif; padding: 8px; border-radius: 8px; background: #f9f9f9; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                            <b style="font-size: 16px;">${name}</b><br>
                            <span style="color: #333;">${sportName.name}</span><br><br>
                            <p style="margin: 10px 0;">${description}</p>
                            ${participantsContent}
                            <time style="font-size: 12px; color: #666;">${new Date(date).toLocaleString()}</time><br>
                            <button style="margin-top: 10px; background-color: #4CAF50; color: white; padding: 10px 24px; border: none; border-radius: 4px; cursor: pointer;">
                                Abandonar evento
                            </button>
                            <button style="margin-top: 10px; background-color: #4CAF50; color: white; padding: 10px 24px; border: none; border-radius: 4px; cursor: pointer;">
                                Chat
                            </button>
                        </div>
                    `);

                    
                } else {
                    const marker = L.marker([latitude, longitude]).addTo(map);
                    marker.bindPopup(`
                        <div style="font-family: Arial, sans-serif; padding: 8px; border-radius: 8px; background: #f9f9f9; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                            <b style="font-size: 16px;">${name}</b><br>
                            <span style="color: #333;">${sportName.name}</span><br><br>
                            <p style="margin: 10px 0;">${description}</p>
                            ${participantsContent}
                            <time style="font-size: 12px; color: #666;">${new Date(date).toLocaleString()}</time><br>
                            <button id="joinEventButton-${_id}-${sportName._id}" style="margin-top: 10px; background-color: #4CAF50; color: white; padding: 10px 24px; border: none; border-radius: 4px; cursor: pointer;">
                                Unirse al evento
                            </button>
                        </div>
                    `);
                }
            });
        };
        
        map.on('popupopen', function(e) {
            const popup = e.popup;
            popup.getElement().querySelectorAll('button[id^="joinEventButton-"]').forEach(button => {
                const [eventId, sportId] = button.id.replace('joinEventButton-', '').split('-');
                button.addEventListener('click', () => handleUnirseEvento(eventId, sportId));
            });

            popup.getElement().querySelectorAll('button[id^="chat-"]').forEach(button => {
                const [eventId, name] = button.id.replace('chat-', '').split('-');
                button.addEventListener('click', () => {
                    handleAbrirChat(eventId, name);
                });
            });

        });
        

        map.on('moveend', async () => {
            setMapCenter(map.getCenter());
            mostrarEventos();
        });

        map.on('click', function(e) {
            setShowFilters(false);
            if (onMapClick === undefined) {
                return;
            }
            const newPosition = [e.latlng.lat, e.latlng.lng];
            onMapClick (newPosition);
            const greenMarker = L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
            });

            // Remove all existing green markers
            map.eachLayer(function(layer) {
            if (layer instanceof L.Marker && layer.options.icon.options.iconUrl === greenMarker.options.iconUrl) {
                map.removeLayer(layer);
            }
            });

            L.marker([e.latlng.lat, e.latlng.lng], { icon: greenMarker }).addTo(map);
        });

        return () => {
            map.off('moveend');
            map.remove();
        };
    }, [events]);

    return(
        <>  
            {showFilters && <FilterMenu onApplyFilters={handleApplyFilters} />}
            
            {filtrar && <FiltersButton onClick={() => setShowFilters(!showFilters)} />}
            <div id="map" style={{ height: altura, width: '100%', overflow: 'hidden' }}></div>
            <Modal isOpen={isModalChatOpen} onClose={closeModalChat}>
                <Chat chat={chat} nombreChat={nombreChat} />
            </Modal>
            <Modal isOpen={isModalConfirmOpen} onClose={closeModalConfirm}>
                <Confirm sport={eventJoinSport} event = {eventJoinId} />
            </Modal>
        </>
    ) 
};

export default Map;