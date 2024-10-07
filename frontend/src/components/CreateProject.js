import React, { useState } from 'react';
import { createProject } from '../apiService';
import { Form, Button, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaProjectDiagram, FaRegEdit } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css'; 
import Footer from './Footer';

const CreateProject = ({ token, userId }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createProject({ name, description, manager: { id: userId } }, token);
            toast.success(`Project created: ${response.name}`);
        } catch (error) {
            toast.error('Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
        <div className="custom-bg">
            <Container className="mt-2 pt-10 text-white">
                <Row className="justify-content-center">
                    <Col md={4} >
                        <Card className="shadow-lg">
                            <Card.Body className='parent1'>
                                <div className="text-center mb-4">
                                    <h2 className="form-title font-weight-bold">Create Project</h2>
                                    <p className="text-muted">Fill in the details to start a new project</p>
                                </div>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label><FaProjectDiagram className="me-2" /> Project Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Enter project name" 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)} 
                                            required 
                                            className="form-control-lg no-shadow"
                                            style={{ borderRadius: '0.25rem', boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' }}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label><FaRegEdit className="me-2" /> Description</Form.Label>
                                        <ReactQuill 
                                            value={description} 
                                            onChange={setDescription} 
                                            placeholder="Enter project description, you can add links, bold text, etc."
                                            theme="snow"
                                            className="quill-editor bg-white"
                                            modules={{
                                                toolbar: [
                                                    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                                                    [{size: []}],
                                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                    [{'list': 'ordered'}, {'list': 'bullet'}],
                                                    ['link', 'image', 'video'],
                                                    ['clean']                                         
                                                ],
                                            }}
                                            formats={[
                                                'header', 'font', 'size',
                                                'bold', 'italic', 'underline', 'strike', 'blockquote',
                                                'list', 'bullet',
                                                'link', 'image', 'video'
                                            ]}
                                            style={{ borderRadius: '0.25rem', borderColor: '#ced4da' }}
                                        />
                                    </Form.Group>

                                    <Button type="submit" className="btn-lg w-100" style={{ borderRadius: '0.25rem', backgroundColor:'#FB6542' }} disabled={loading}>
                                        {loading ? <Spinner animation="border" size="sm" /> : 'Create Project'}
                                    </Button>
                                </Form>
                                <ToastContainer />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            </div>
            <Footer/>
        </div>
    );
};

export default CreateProject;
