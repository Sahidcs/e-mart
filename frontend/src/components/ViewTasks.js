import React, { useState, useEffect } from 'react';
import { getTasksByUserPageable, getTasksByProjectPageable } from '../apiService';
import { Container, Row, Col, Card, Alert, ListGroup, Button, Badge, Dropdown } from 'react-bootstrap';
import { BsCalendar, BsClock, BsExclamationTriangle, BsCheckCircle, BsPencil } from 'react-icons/bs';
import { FaEdit, FaTasks } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import Footer from './Footer';
import EditTaskModal from './EditTaskModal';

const ViewTasks = ({ token, userId, projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [expandedTaskIds, setExpandedTaskIds] = useState([]);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [size, setSize] = useState(6);
    const [sort, setSort] = useState('dueDate');
    const [direction, setDirection] = useState('asc');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                let response;
                if (userId) {
                    response = await getTasksByUserPageable(userId, token, page, size, sort, direction);
                } else if (projectId) {
                    response = await getTasksByProjectPageable(projectId, token, page, size, sort, direction);
                }
                const now = new Date();
                const updatedTasks = response.content.map(task => {
                    const dueDate = new Date(task.dueDate);
                    if (dueDate < now && task.status !== 'Completed') {
                        return { ...task, status: 'Incomplete' };
                    }
                    return task;
                });

                setTasks(updatedTasks);
                setTotalPages(response.totalPages);
            } catch (error) {
                setMessage('Failed to fetch tasks');
            }
        };

        fetchTasks();
    }, [token, userId, projectId, page, size, sort, direction]);

    useEffect(() => {
        if (filter === 'completed') {
            setFilteredTasks(tasks.filter(task => task.status === 'Completed'));
        } else if (filter === 'incomplete') {
            setFilteredTasks(tasks.filter(task => task.status === 'Incomplete'));
        } else if (filter === 'pending') {
            setFilteredTasks(tasks.filter(task => task.status === 'Pending'));
        } else {
            setFilteredTasks(tasks);
        }
    }, [filter, tasks]);

    const toggleExpand = (taskId) => {
        setExpandedTaskIds(prevState =>
            prevState.includes(taskId)
                ? prevState.filter(id => id !== taskId)
                : [...prevState, taskId]
        );
    };

    const handlePageChange = ({ selected }) => {
        setPage(selected);
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
    };

    const handleDirectionChange = (newDirection) => {
        setDirection(newDirection);
    };

    const handleEditClick = (task) => {
        setCurrentTask(task); 
        setShowEditModal(true); 
    };
    const handleSaveTask = (updatedTask) => {
        setTasks(prevTasks =>
            prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
        );
    };
    return (
        <div className='mt-1 parent wh-100 container'>
            <Container className="mt-4 vh-auto">
                <h2 className="mb-4 text-center"><FaTasks /> View Tasks</h2>
                {message && <Alert variant="danger"><BsExclamationTriangle /> {message}</Alert>}
               
                <div className='d-flex justify-content-around'>
                    <Dropdown className="mb-4 d-flex justify-content-center">
                        <Dropdown.Toggle variant="warning" id="filter-dropdown">
                            {filter === 'all' ? 'All Tasks' : 
                             filter === 'pending' ? 'Pending Tasks' :
                             filter === 'incomplete' ? 'Incomplete Tasks' :
                             filter === 'completed' ? 'Completed Tasks' : 'Filter Tasks'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setFilter('all')}>All Tasks</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter('pending')}>Pending Tasks</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter('incomplete')}>Incomplete Tasks</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter('completed')}>Completed Tasks</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown className="mb-4 d-flex justify-content-center">
                        <Dropdown.Toggle variant="warning" id="sort-dropdown">
                            {sort === 'dueDate' ? 'Sort by Due Date' : 'Sort by Name'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleSortChange('dueDate')}>Sort by Due Date</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSortChange('name')}>Sort by Name</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown className="mb-4 d-flex justify-content-center">
                        <Dropdown.Toggle variant="warning" id="direction-dropdown">
                            {direction === 'asc' ? 'Ascending' : 'Descending'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleDirectionChange('asc')}>Ascending</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDirectionChange('desc')}>Descending</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
              
                <Row>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map(task => (
                            <Col key={task.id} md={4} className="mb-3">
                                <Card className="shadow-sm border-0">
                                    <Card.Body>
                                        <Card.Title className="d-flex justify-content-between align-items-center">
                                            {task.name}
                                            <Badge pill bg={
                                                task.status === 'Completed' ? 'success' :
                                                task.status === 'Incomplete' ? 'danger' :
                                                task.status === 'Pending' ? 'warning' : 'secondary'
                                            }>
                                                {task.status === 'Completed' ? <BsCheckCircle /> :
                                                 task.status === 'Incomplete' ? <BsExclamationTriangle /> :
                                                 task.status === 'Pending' ? <BsPencil /> : null} {task.status}
                                            </Badge>
                                        </Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            <BsCalendar /> Due Date: {task.dueDate}
                                        </Card.Subtitle>
                                        <Card.Text className="task-description">
                                            {expandedTaskIds.includes(task.id) ? (
                                                <div dangerouslySetInnerHTML={{ __html: task.description }} />
                                            ) : (
                                                <div className="text-truncate" style={{ maxHeight: '3.6em', overflow: 'hidden' }}>
                                                    <div dangerouslySetInnerHTML={{ __html: task.description }} />
                                                </div>
                                            )}
                                        </Card.Text>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                <BsClock /> Status: {task.status}
                                            </ListGroup.Item>
                                        </ListGroup>
                                        <Button 
                                            variant={expandedTaskIds.includes(task.id) ? 'warning' : 'info'} 
                                            className="mt-3 w-100" 
                                            onClick={() => toggleExpand(task.id)}
                                        >
                                            {expandedTaskIds.includes(task.id) ? 'Hide Details' : 'View Details'}
                                        </Button>
                                        <Button 
                                            variant="outline-info" 
                                            className="mt-2 w-100" 
                                            onClick={() => handleEditClick(task)}
                                        >
                                           <FaEdit />
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <Alert variant="info" className="text-center"><BsExclamationTriangle /> No tasks available.</Alert>
                        </Col>
                    )}
                </Row>
                <div className="pagination-container">
                    <ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        pageCount={totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName={'pagination'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        breakClassName={'page-item'}
                        breakLinkClassName={'page-link'}
                        activeClassName={'active'}
                    />
                </div>
                <EditTaskModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    task={currentTask}
                    token={token}
                    onSave={handleSaveTask}
                    handleSave={handleSaveTask}
                />
            </Container>
            <Footer />
        </div>
    );
};

export default ViewTasks;
