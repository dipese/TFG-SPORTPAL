import React, { useState } from 'react';

const CreateEventModal = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [deporte, setDeporte] = useState('');
    const [reglas, setReglas] = useState('');
    const [localizacion, setLocalizacion] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'nombre':
                setNombre(value);
                break;
            case 'descripcion':
                setDescripcion(value);
                break;
            case 'deporte':
                setDeporte(value);
                break;
            case 'reglas':
                setReglas(value);
                break;
            case 'localizacion':
                setLocalizacion(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes realizar la lógica para enviar los datos del evento al servidor
        // Por ejemplo, puedes hacer una llamada a una API para guardar los datos en la base de datos
        console.log('Datos del evento:', { nombre, descripcion, deporte, reglas, localizacion });
        // Cerrar la ventana modal o realizar alguna otra acción después de enviar los datos
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" value={nombre} onChange={handleInputChange} />

                <label htmlFor="descripcion">Descripción:</label>
                <input type="text" id="descripcion" name="descripcion" value={descripcion} onChange={handleInputChange} />

                <label htmlFor="deporte">Deporte:</label>
                <input type="text" id="deporte" name="deporte" value={deporte} onChange={handleInputChange} />

                <label htmlFor="reglas">Reglas:</label>
                <input type="text" id="reglas" name="reglas" value={reglas} onChange={handleInputChange} />

                <label htmlFor="localizacion">Localización:</label>
                <input type="text" id="localizacion" name="localizacion" value={localizacion} onChange={handleInputChange} />

                <button type="submit">Crear evento</button>
            </form>
        </div>
    );
};

export default CreateEventModal;