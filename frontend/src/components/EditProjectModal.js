import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createProject, updateProject } from '../apiService';  

const EditProjectModal = ({ project, show, handleClose, handleSave, token }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (project) {
            setName(project.name || '');
            setDescription(project.description || '');
        }
    }, [project]);

    const handleSubmit = async () => {
        if (!name || !description) {
            setError('Please fill out all fields.');
            return;
        }

        const updatedProject = { id: project.id, name, description };
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await updateProject(updatedProject, token); 
            console.log(result);
            
            handleSave(result); 
            handleClose(); 
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to update the project. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>} 
                <Form>
                    <Form.Group controlId="projectName">
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter project name"
                        />
                    </Form.Group>

                    <Form.Group controlId="projectDescription" className="mt-3">
                        <Form.Label>Project Description</Form.Label>
                        <ReactQuill
                            theme="snow"
                            value={description}
                            onChange={setDescription}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-info" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="info" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" /> : 'Save Changes'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditProjectModal;