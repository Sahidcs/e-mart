import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { loginUser } from '../apiService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const Login = ({ setToken, setUserId, showToast }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await loginUser({ username: email, password });
            if (response && response.token) {
                setToken(response.token);
                setUserId(response.user_id);
                showToast('Login successful!', 'success');
                setLoading(false);
                navigate('/');
            } else {
                setMessage('Login failed: No token received');
                showToast('Login failed: No token received', 'error');
                setLoading(false);
            }
        } catch (error) {
            setMessage('Login failed');
            toast.error("error in the login");
            setLoading(false);
        }
    };

    return (
        <div className='vh-100 w-50'>
            <Container className="mt-5 pt-5 border rounded border-light shadow-sm pl-4 pr-4 mr-md-5" style={{ backgroundColor: '#fff', maxWidth: '400px' }}>
            <Row className="justify-content-center">
                <Col>
                    <h2 className="text-center mb-4">Login</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label><FaEnvelope className="me-2" />Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter your username" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="form-control-lg"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaLock className="me-2" />Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter your password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="form-control-lg"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 btn-lg mb-1 btn-warning">{loading===false?"Login":<Spinner></Spinner>}</Button>
                        <div className='mb-1'>
                        <Link to="/register" className="create-account-link align-text-left text-decoration-none text-info ">
    create account
</Link>
                        </div>
            
                    </Form>
                    {message && (
                        <Alert variant={message.includes('failed') ? 'danger' : 'success'} className="mt-3">
                            {message}
                        </Alert>
                    )}
                </Col>
            </Row>
        </Container>
        </div>
      
    );
};

export default Login;
