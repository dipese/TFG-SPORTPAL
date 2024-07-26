/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import API from '../../api';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const client = new API();

const userData = JSON.parse(localStorage.getItem('user'));

const Chat = ({ chat, nombreChat }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(chat.messages);
    const [participants, setParticipants] = useState([]);


    useEffect(() => {
        socket.emit('joinChat', { chatId: chat._id });

        socket.on('message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off('message');
        };
            
    }, [chat._id]);


    useEffect(() => {
        const fetchParticipants = async () => {
            const users = await Promise.all(chat.participants.map(async (id) => {
                try {
                    const user = await client.getUsers({ _id: id });
                    return user[0];
                } catch (error) {
                    console.error("Error fetching user:", error);
                    return null;
                }
            }));

            setParticipants(users.filter(user => user !== null));
        };

        fetchParticipants();
    }, [chat.participants]);


    const handleSendMessage = () => {
        if (!message.trim()) return;

        socket.emit('sendMessage', { chatId: chat._id, message: { sender: userData._id , content: message , date: Date.now()} });
        setMessage('');
    };

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    return (

        <div style={styles.chatContainer}>
            <h2 style={styles.chatTitle}>{nombreChat}</h2>
            <div style={styles.messagesContainer}>
            {messages.map((msg) => {
                const sender = participants.find((participant) => participant._id === msg.sender);
                const isUserMessage = msg.sender === userData._id;

                return (
                    <div key={msg._id} style={isUserMessage ? styles.messageRight : styles.messageLeft}>
                        <div style={styles.senderName}>{sender ? sender.username : msg.sender}</div>
                        <div style={styles.messageContent}>{msg.content}</div>
                        <div style={styles.messageDate}>{formatDate(msg.date)}</div>
                    </div>
                );
            })}
            </div>
            <div style={styles.inputContainer}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button style={styles.sendButton} onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

const styles = {
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '600px', 
        overflowY: 'auto',
    },
    messagesContainer: {
        flexGrow: 1,
        overflowY: 'auto', 
        padding: '10px',
        maxHeight: '540px',
    },
    message: {
        backgroundColor: '#f3f3f3',
        borderRadius: '5px',
        padding: '8px',
        margin: '5px 0',
    },
    inputContainer: {
        display: 'flex',
        padding: '10px',
    },
    input: {
        flexGrow: 1,
        marginRight: '10px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    sendButton: {
        padding: '10px 15px',
        cursor: 'pointer',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
    },
    messageRight: {
        backgroundColor: '#dcf8c6', // Un color de fondo diferente para destacar los mensajes del usuario
        borderRadius: '5px',
        padding: '8px',
        margin: '5px 0',
        marginLeft: 'auto', // Alinea el mensaje a la derecha
    },
    messageLeft: {
        backgroundColor: '#f3f3f3', // Color de fondo para mensajes de otros usuarios
        borderRadius: '5px',
        padding: '8px',
        margin: '5px 0',
        marginRight: 'auto', // Alinea el mensaje a la izquierda
    },
    senderName: {
        fontWeight: 'bold',
    },
    messageContent: {
        fontSize: '16px', // Hace que el contenido del mensaje destaque
        margin: '5px 0',
    },
    messageDate: {
        fontSize: '12px', // Hace la fecha más pequeña
        color: '#666', // Color gris para que sea menos prominente
    },
};

export default Chat;