import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { updateTask } from '../apiService';  

const EditTaskModal = ({ task, show, handleClose, handleSave, token }) => {
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); 

    useEffect(() => {
        if (task) {
            setDescription(task.description || '');
            setStatus(task.status || '');
        }
    }, [task]);

    const handleSubmit = async () => {
        if (!task || !status) { 
            setError('Please select a status before submitting.');
            return;
        }
        const updatedTask = { id: task.id, description, status };
        setIsLoading(true);
        setError(null); 
        try {
            const result = await updateTask(updatedTask, token);  
            handleSave(result);  
            handleClose(); 
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to update the task. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>} 
                <Form>
                    <Form.Group controlId="taskDescription">
                        <Form.Label>Task Description</Form.Label>
                        <ReactQuill
                            theme="snow"
                            value={description}
                            onChange={setDescription}
                        />
                    </Form.Group>

                    <Form.Group controlId="taskStatus" className="mt-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Incomplete">Incomplete</option>
                            <option value="Complete">Completed</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-info" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="info" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? <Spinner/> : 'Save Changes'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditTaskModal;
