import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { CloudUpload } from 'react-bootstrap-icons'; 
import axios from 'axios';
const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileNameChange = (e) => {
        setFileName(e.target.value);
    };

    const handleFileTypeChange = (e) => {
        setFileType(e.target.value);
    };

    const handleUpload = async () => {
        if (!file || !fileName || !fileType) {
            setError('All fields are required!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);
        formData.append('fileType', fileType);

        try {
            const response = await axios.post('http://localhost:8080/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data);
            setError('');
        } catch (err) {
            setError('Failed to upload file.');
            setMessage('');
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Upload File <CloudUpload className="text-primary ms-2" size={24} /></h2>
            <Form>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>File</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <Form.Group controlId="formFileName" className="mb-3">
                    <Form.Label>File Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter file name" 
                        value={fileName} 
                        onChange={handleFileNameChange} 
                    />
                </Form.Group>
                <Form.Group controlId="formFileType" className="mb-3">
                    <Form.Label>File Type</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter file type" 
                        value={fileType} 
                        onChange={handleFileTypeChange} 
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleUpload}>
                    <CloudUpload className="me-2" size={16} />
                    Upload
                </Button>
            </Form>
            {message && <Alert variant="success" className="mt-3">{message}</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Container>
    );
};

export default FileUpload;
