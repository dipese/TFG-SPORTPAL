/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button style={styles.closeButton} onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000, // Aumentado para asegurar que el modal esté por encima de otros elementos
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '5px',
        padding: '20px',
        minWidth: '300px',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
    },
    closeButton: {
        alignSelf: 'flex-end',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
    },
};

export default Modal;