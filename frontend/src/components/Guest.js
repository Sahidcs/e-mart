import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { registerUser, loginUser } from '../apiService';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ setToken, setUserId }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState('ROLE_USER');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await registerUser({ name, email, password, roles });
            if (response != null) {
            
                const loginResponse = await loginUser({ username: name, password });
                toast.success('Registration successful! Logging in...');
                if (loginResponse) {
                    setToken(loginResponse.token);
                    setUserId(loginResponse.user_id);
                    setLoading(false);
                    navigate('/');
                } else {
                    setMessage('Login failed: No token received');
                    toast.error('Login failed: No token received');
                    setLoading(false);
                }
            } else {
                setMessage(response.message || 'Registration failed');
                toast.error(response.message || 'Registration failed');
                setLoading(false);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage('Registration failed');
            toast.error('Registration failed');
        }
    };

    return (
        <div className='vh-100 w-50'>
           
        </div>
        
    );
};

export default Register;
