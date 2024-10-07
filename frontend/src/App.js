import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Alert } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa'; 
import Register from './components/Register';
import Login from './components/Login';
import CreateProject from './components/CreateProject';
import AssignTask from './components/AssignTask';
import ViewTasks from './components/ViewTasks';
import Home from './components/Home';
import ViewProjects from './components/ViewProjects';
import Dashboard from './components/DashBoard';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Footer from './components/Footer';
import InfoPage from './components/InfoPage';
import Info from './components/Info';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
    const [projectId, setProjectId] = useState(null);
    const userName = "User"; 

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        if (userId) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId');
        }
    }, [userId]);

    const handleLogout = () => {
        setToken('');
        setUserId(null);
        toast.success("Logout successfully");
      
    };

    const showToast = (message, type) => {
        toast.success(message);
    };

    return (
        <Router>
            <div className='parent mh-100 vw-100'>
                <Navbar variant="secondary" className="custom-navbar my-navbar shadow p-3 mb-3 rounded text-muted border border-light  d-flex justify-content-center bg-zinc-800 app-navbar ">
                    <Container className='app-navbar'>
                        <Navbar.Brand as={Link} to="/" className='font-weight-bold ' style={{ fontSize: '1.5rem', color: '#000', fontWeight: 800 }}>RemoteTeam</Navbar.Brand>
                        <Nav className="me-auto">
                            {token ? (
                                <>
                                  <Nav.Link as={Link} to="/view-projects">View Projects</Nav.Link>
                                    <Nav.Link as={Link} to="/create-project">Create Project</Nav.Link>
                                    <Nav.Link as={Link} to="/assign-task">Assign Task</Nav.Link>
                                    <Nav.Link as={Link} to="/view-tasks">View Tasks</Nav.Link>
                                    <Nav.Link as={Link} to="/dashboard">View DashBoard</Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/" style={{ fontWeight: 600,fontSize:'1.2rem'}} >Home</Nav.Link>
                                </>
                            )}
                        </Nav>
                        <div className="d-flex align-items-center">
                            {token && (
                                <>
                                    <Button 
                                        className="me-4  btn btn btn-warning" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                    <Button 
                                        className='btn btn btn-warning' 
                                        as={Link} 
                                        to="/create-project"
                                    >
                                        <FaPlus className="me-2" /> Create Project
                                    </Button>
                                </>
                            )}
                        </div>
                    </Container>
                </Navbar>

                <div className=" parent  d-flex justify-content-center ">
                    <Routes>
                        <Route path="/" element={token ? (
                            <div >
                                <div className='d-flex flex-column justify-content-center align-items-center'>
                                <h2>Welcome, {userName}!</h2>
                                <p>This is your dashboard where you can manage projects and tasks.</p>
                                <Alert variant="info" className="custom-alert">
                                    <h4>Features of Our Website:</h4>
                                    <ul>
                                        <li><strong>Create and manage projects:</strong> Initiate new projects, set deadlines, and manage all aspects of your projects seamlessly.</li>
                                        <li><strong>Assign tasks to users:</strong> Easily delegate tasks to your team members and monitor their progress.</li>
                                        <li><strong>Track the progress of tasks:</strong> Keep an eye on ongoing tasks and make sure everything stays on schedule.</li>
                                        <li><strong>View all tasks and project details:</strong> Get a comprehensive view of all tasks and project details in one place.</li>
                                    </ul>
                                </Alert>
                                </div>
                               <Info/>
                                <Footer/>
                            </div>
                        ) : (
                            <div>
                            <Home setToken={setToken} setUserId={setUserId} />
                            <Info/>
                            <Footer/>
                            </div>
                           
                        )} />
                        
                        <Route path="/register" element={<Register setToken={setToken} setUserId={setUserId} />} />
                        <Route path="/login" element={<Login setToken={setToken} setUserId={setUserId} showToast={showToast} />} />
                        <Route path="/create-project" element={token ? <CreateProject token={token} userId={userId}/> : <Navigate to="/login" />} />
                        <Route path="/assign-task" element={token ? <AssignTask token={token} /> : <Navigate to="/login" />} />
                        <Route path="/view-tasks" element={token ? <ViewTasks token={token} userId={userId} projectId={projectId} /> : <Navigate to="/login" />} />
                        <Route path="/view-projects" element={token ? <ViewProjects token={token} userId={userId} /> : <Navigate to="/login" />} />
                        <Route path="/dashboard" element={token ? <Dashboard token={token} userId={userId} /> : <Navigate to="/login" />} />
                    </Routes>
                </div>
              
            </div>
            <ToastContainer />
        </Router>
    );
};

export default App;
