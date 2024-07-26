// CreateEventForm.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import API from '../../api'; // Asegúrate de que la ruta sea correcta
import Map from '../../componets/map';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        sport: '',
        location: '',
        coordinates: { lat: 0, lng: 0 },
    });
    const [sports, setSports] = useState([]);

    const [errors, setErrors] = useState({});

    const [mostrarInfo, setMostrarInfo] = useState(false);

    const toggleInfo = () => {
        setMostrarInfo(!mostrarInfo);
    };

    useEffect(() => {
        const fetchSports = async () => {
            const sportsData = await API.instance().getSports();
            setSports(sportsData || []);
        };

        fetchSports();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors,    [e.target.name]: '' });
    };

    const [clickedPosition, setClickedPosition] = useState([0, 0]);

    const handleMapClick = (position) => {
        setClickedPosition(position);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        if (!formData.name) newErrors.name = 'El nombre es obligatorio';
        if (!formData.description) newErrors.description = 'La descripción es obligatoria';
        if (!formData.date) newErrors.date = 'La fecha es obligatoria';
        if (!formData.sport || formData.sport == 'seleccionar') newErrors.sport = 'El deporte es obligatorio';
        if (!formData.location) newErrors.location = 'La ubicación es obligatoria';
        if (!clickedPosition) newErrors.location = 'Selecciona una ubicación en el mapa';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const event = {
                name: formData.name,
                description: formData.description,
                date: formData.date,
                sport: formData.sport.split(',')[0],
                teamSport: formData.sport.split(',')[1],
                location: {
                    locDescription: formData.location,
                    latitude: clickedPosition[0],
                    longitude: clickedPosition[1],
                },
            };
            const response = await API.instance().createEvent(event);
            if (response) {
                window.location.href = '/';
            } else {
                alert('Error al crear el evento');
            }
        }

        
    };

    // Estilos similares a los del Header
    const baseStyles = {
        fontFamily: "'Roboto', sans-serif",
        color: '#333',
        backgroundColor: '#f4f4f4',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    };
    
    const formStyle = {
        ...baseStyles,
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'lightgray',
    };
    
    const inputStyle = {
        ...baseStyles,
        border: '1px solid #ccc',
        marginBottom: '10px',
        width: 'calc(100% - 40px)', // 20px padding on each side
        height: '40px',
    };

    const selectStyle = {
        ...inputStyle,
        width: '100%',
        height: '60px',
    };
    
    const buttonStyle = {
        ...baseStyles,
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        ':hover': {
            backgroundColor: '#0056b3',
        },
        ':focus': {
            outline: '2px solid #0056b3',
            outlineOffset: '2px',
        },
        flex: 1
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'row', marginRight: '10px' }}>
            <div style={{ width: '90%' }}>
                <Map onMapClick={handleMapClick} altura={'98.25vh'} />
            </div>
            <div style={{ width: '20%', padding: '10px', marginLeft: '10px' }}>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            style={inputStyle}
                            type="text"
                            name="name"
                            placeholder="Nombre del evento"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.name}</p>}

                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <textarea
                            style={inputStyle}
                            name="description"
                            placeholder="Descripción"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        {errors.description && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.description}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            style={inputStyle}
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                        {errors.date && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.date}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <select
                            style={selectStyle}
                            name="sport"
                            value={formData.sport}
                            onChange={handleChange}
                        >
                            <option value="seleccionar">Seleccionar Deporte</option>
                            {sports.map((sport) => (
                                <option key={sport._id} value={[sport._id, sport.team]}>
                                    {sport.name}
                                </option>
                            ))}
                        </select>
                        {errors.sport && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.sport}</p>}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            style={inputStyle}
                            type="text"
                            name="location"
                            placeholder="Descripción Ubicación"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.location && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.location}</p>}
                    {errors.coordinates && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.coordinates}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                        <button style={buttonStyle} type="submit">
                            Crear Evento
                        </button>
                        <button style={{ ...buttonStyle, backgroundColor: 'red', marginLeft: '10px'  }} onClick={() => window.location.href = '/'}>
                            Cancelar
                        </button>
                        
                    </div>
                    <button
                        style={{
                            ...buttonStyle,
                            backgroundColor: 'gray',
                            marginTop: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10%',
                            height: '10px',
                        }}
                        onClick={toggleInfo}
                    >
                        <FontAwesomeIcon icon={faCircleInfo} style={{ marginRight: '10px' }} />
                        
                    </button>
                </form>

                {mostrarInfo && (
                    <div style={{
                        ...baseStyles, // Reutiliza los estilos base para coherencia
                        marginTop: '20px', // Espacio por encima del cuadrado
                        padding: '20px', // Espacio interior para el contenido
                        backgroundColor: 'white', // Fondo blanco para el cuadrado
                        textAlign: 'center', // Centrar el texto dentro del cuadrado
                    }}>
                        <h2 style={{ marginTop: 0 }}>Cómo Crear un Evento</h2>
                        <p>Para crear un evento, simplemente completa el formulario con la información requerida y haz clic en Crear Evento. Asegúrate de llenar todos los campos obligatorios.</p>
                    </div>
                )}

                
            </div>
        </div>
    );
};

export default CreateEvent;