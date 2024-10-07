import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaTasks, FaProjectDiagram, FaUser, FaHome, FaChartPie, FaCog } from 'react-icons/fa';
import Avatar from 'react-avatar';
import { getTaskCounts, getProjectCount, getUserDetails, getTaskOfOneYear } from '../apiService';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import './css/AssignTask.css';
import CustomCalendar from './CustomCalender';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const SparkLineChart = ({ data }) => (
    <div style={{ position: 'relative', width: '100%' }}>
        <Sparklines data={data} margin={5}>
            <SparklinesLine color="blue" />
        </Sparklines>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            {months.map((month, index) => (
                <div key={index} style={{ width: `${100 / months.length}%`, textAlign: 'center' }}>
                    {month}
                </div>
            ))}
        </div>
    </div>
);

const Dashboard = ({ token, userId}) => {
    const [taskCounts, setTaskCounts] = useState({ complete: 0, incomplete: 0, pending: 0 });
    const [projectCount, setProjectCount] = useState(0);
    const [userDetails, setUserDetails] = useState({});
    const [taskCountsByMonth, setTaskCountsByMonth] = useState([]);
    const [ratios, setRatios] = useState(Array(12).fill(0));
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date()); 
    const [dateArray,setDateArray]=useState(Array(12).fill(0));
    useEffect(() => {

        const fetchData = async () => {
            try {
                const tasks = await getTaskCounts(token, userId);
                const { complete, incomplete, pending } = tasks;
                setTaskCounts({ complete, incomplete, pending });
                const response = await getTaskOfOneYear(token, userId);
                const taskCountsByMonth=response.taskCountsByMonth;
                setDateArray(response.dateArray);
                setTaskCountsByMonth(response.taskCountsByMonth);
                const totalTasks = taskCountsByMonth.map(monthData => monthData.total);
                const completedTasks = taskCountsByMonth.map(monthData => monthData.complete);
                const ratios = totalTasks.map((total, index) => total === 0 ? 0 : (completedTasks[index] / total) * 100);
                setRatios(ratios);

                const projectsResponse = await getProjectCount(token, userId);
                setProjectCount(projectsResponse);

                const userResponse = await getUserDetails(token, userId);
                setUserDetails(userResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, userId]);

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }
   
    const totalTasks = taskCounts.complete + taskCounts.incomplete + taskCounts.pending;
    const pieData = {
        labels: ['Completed Tasks', 'Incomplete Tasks', 'Pending'],
        datasets: [
            {
                label: 'Tasks',
                data: [taskCounts.complete, taskCounts.incomplete, taskCounts.pending],
                backgroundColor: ['#0bff5c', ' #f82828 ', '#ff9e7b'],
                borderWidth: 1,
                hoverOffset: 4
            }
        ]
    };

    return (
        <div className="d-flex vh-auto dashboard1 text-sm" style={{ backgroundColor: '#151536' }}>
            <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
                <div className="d-flex flex-column align-items-center">
                    <Avatar name={userDetails.name} size="100" round className="mb-3" />
                    <h4>{userDetails.name}</h4>
                    <p>{userDetails.email}</p>
                </div>
                <hr className="my-4" />
                <nav className="nav flex-column">
            <Link to="/" className="nav-link text-white">
                <FaHome className="me-2" /> Home
            </Link>
            <Link to="/view-tasks" className="nav-link text-white">
                <FaTasks className="me-2" /> Tasks
            </Link>
            <Link to="/view-projects" className="nav-link text-white">
                <FaProjectDiagram className="me-2" /> Projects
            </Link>
            <Link to="/analytics" className="nav-link text-white">
                <FaChartPie className="me-2" /> Chats
            </Link>
            <Link to="/settings" className="nav-link text-white">
                <FaCog className="me-2" /> Settings
            </Link>
        </nav>
            </div>

            <div className="container-fluid p-4">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card mb-4 border-0">
                            <div className="card-body text-center text-white"  style={{background:'rgb(36 36 68)'}}>
                                <FaTasks size={40} className="text-primary mb-3" />
                                <h5 className="card-title">Task Overview</h5>
                                {totalTasks === 0 ?
                                    <h1 className='text-warning'>No Tasks Assigned</h1>
                                    : <div className="pie-chart-container">
                                        <Pie
                                            data={pieData}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: { position: 'top' },
                                                    tooltip: {
                                                        callbacks: {
                                                            label: (context) => `${context.label}: ${context.raw}`
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                }
                                <p className="mt-3">Total Tasks: {totalTasks}</p>
                            </div>
                        </div>
                    </div>
                   
                    <div className="col-md-2">
                        <div className="card mb-3 text-white" style={{background:'rgb(36 36 68)'}}>
                            <div className="card-body d-flex flex-column align-items-center">
                                <div className="d-flex align-items-center mb-4">
                                    <FaProjectDiagram size={20} className="text-success me-3" />
                                    <h4 className="card-title mb-0">Project Count</h4>
                                </div>
                                <div className="d-flex align-items-center mb-4">
                                    <h2 className="card-title mb-0">{projectCount}</h2>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="w-auto">
                        <div className="card border-0 text-white" style={{background:'rgb(36 36 68)'}}>
                            <div className="card-body">
                              
                             <CustomCalendar dateArray={dateArray}/>
                            </div>
                   
                    </div>
                    </div>
                    <div className="md-6 d-flex ">
                        <div className="card d-flex w-50 mb-4 me-2 bg-transparent text-white">
                            <div className="card-body">
                                <h5 className="card-title">Monthly Task Count (Total)</h5>
                                <SparkLineChart data={taskCountsByMonth.map(monthData => monthData.total)} />
                            </div>
                        </div>

                        <div className="vr" style={{
                            borderLeft: '1px solid #ccc', 
                            height: '100%',
                            marginRight: '16px'
                        }}></div>

                        <div className="card d-flex w-50 mb-4 bg-transparent text-white">
                            <div className="card-body">
                                <h5 className="card-title">Monthly Task Count (Completed)%</h5>
                                <SparkLineChart data={taskCountsByMonth.map(monthData => monthData.complete)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
