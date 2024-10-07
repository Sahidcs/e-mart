import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { registerUser, loginUser } from '../apiService';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ setToken, setUserId }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState('ROLE_USER');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

    const validateName = (name) => name.length >= 3;

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            name: validateName(value) ? '' : 'Username must be at least 3 characters long',
        }));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            email: validateEmail(value) ? '' : 'Please enter a valid email address',
        }));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            password: validatePassword(value) ? '' : 'Password must be at least 6 characters long and contain both letters and numbers',
        }));
    };

    const validateForm = () => {
        const formErrors = {};
        if (!validateName(name)) formErrors.name = 'Username must be at least 3 characters long';
        if (!validateEmail(email)) formErrors.email = 'Please enter a valid email address';
        if (!validatePassword(password)) formErrors.password = 'Password must be at least 6 characters long and contain both letters and numbers';
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const response = await registerUser({ name, email, password, roles });
            if (response) {
                const loginResponse = await loginUser({ username: name, password });
                toast.success('Registration successful! Logging in...');
                if (loginResponse) {
                    setToken(loginResponse.token);
                    setUserId(loginResponse.user_id);
                    navigate('/');
                } else {
                    toast.error('Login failed: No token received');
                }
            } else {
                toast.error(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='vh-100 w-50'>
            <Container className="mt-4 border rounded border-light shadow-sm" style={{ backgroundColor: '#fff', maxWidth: '400px' }}>
                <Row className="justify-content-center">
                    <Col>
                        <h2 className="text-center mb-2 mt-2">Register</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label><FaUser className="me-2" />Username</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter your username" 
                                    value={name} 
                                    onChange={handleNameChange} 
                                    required 
                                    className="form-control-lg no-shadow"
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label><FaEnvelope className="me-2" />Email</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={email} 
                                    onChange={handleEmailChange} 
                                    required 
                                    className="form-control-lg no-shadow"
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label><FaLock className="me-2" />Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Enter your password" 
                                    value={password} 
                                    onChange={handlePasswordChange} 
                                    required 
                                    className="form-control-lg no-shadow"
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Select 
                                    value={roles} 
                                    onChange={(e) => setRoles(e.target.value)}
                                    className="form-control-lg"
                                >
                                    <option value="ROLE_USER">User</option>
                                    <option value="ROLE_MANAGER">Manager</option>
                                </Form.Select>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 btn-lg mb-1 mt-2 btn-warning">
                                {loading ? <Spinner animation="border" size="sm" /> : "Register"}
                            </Button>

                            <Link to="/login" className="create-account-link align-text-left text-decoration-none text-info">
                                Login
                            </Link>
                        </Form>

                        <ToastContainer />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;
