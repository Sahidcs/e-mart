import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import './css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer text-white">
            <Container fluid className="py-2">
                <Row className='mt-4 mb-1'>
                    <Col md={4} className="text-center text-md-left mb-3">
                        <h5 className="footer-heading" style={{ fontFamily: "'Baskervville SC', serif", fontWeight: 400, fontStyle: 'normal' }}>
                            Project Management App
                        </h5>
                        <p className="footer-description">
                            Efficiently manage projects, assign tasks, and track progress all in one place.
                            <strong style={{color:'#fff'}}>Create and manage projects:</strong> Initiate new projects, set deadlines, and manage all aspects of your projects seamlessly.
                            <strong style={{color:'#fff'}}>Assign tasks to users:</strong> Easily delegate tasks to your team members and monitor their progress.
                            <strong style={{color:'#fff'}}>Track the progress of tasks:</strong> Keep an eye on ongoing tasks and make sure everything stays on schedule.
                        </p>
                    </Col>
                    <Col md={4} className="text-center mb-3">
                        <h5 className="footer-heading">Quick Links</h5>
                        <ul className="list-unstyled footer-links">
                            <li><a href="/" className="text-white">Home</a></li>
                            <li><a href="/about" className="text-white">About Us</a></li>
                            <li><a href="/contact" className="text-white">Contact</a></li>
                        </ul>
                    </Col>
                    <Col md={4} className="text-center text-md-right mb-3">
                        <h5 className="footer-heading">Follow Us</h5>
                        <div className="footer-social">
                            <a href="https://facebook.com" className="text-white mx-3"><FaFacebook /></a>
                            <a href="https://twitter.com" className="text-white mx-3"><FaTwitter /></a>
                            <a href="https://linkedin.com" className="text-white mx-3"><FaLinkedin /></a>
                            <a href="https://github.com" className="text-white mx-3"><FaGithub /></a>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-0">
                    <Col className="text-center">
                        <p className="mb-0">© {new Date().getFullYear()} Project Management App. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
