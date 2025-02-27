// components/dashboard/RoadmapsList.jsx
import React from 'react';
import { ListGroup, Card, ProgressBar, Badge, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaRoute as RoadmapIcon, FaArrowRight as ArrowIcon, FaCalendarAlt as CalendarIcon, FaClock as TimeIcon, FaCheckCircle as CheckIcon, FaGraduationCap as SkillIcon } from 'react-icons/fa';

const RoadmapsList = ({ roadmaps, detailed = false }) => {
    if (!roadmaps || roadmaps.length === 0) {
        return (
            <div className="text-center py-3">
                <p className="text-secondary">No roadmaps available</p>
            </div>
        );
    }

    // If detailed view, show cards with more information
    if (detailed) {
        return (
            <div className="row">
                {roadmaps.map((roadmapProgress) => {
                    const roadmap = roadmapProgress.roadmap;
                    const completedSkills = roadmapProgress.skillProgress.filter(sp => sp.completed).length;
                    const totalSkills = roadmapProgress.skillProgress.length;

                    return (
                        <div className="col-12 col-md-6 mb-3" key={roadmap._id}>
                            <Card className="h-100">
                                <Card.Body>
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex">
                                            <div className="bg-primary text-white rounded-circle p-2 me-2">
                                                <RoadmapIcon />
                                            </div>
                                            <div>
                                                <Card.Title>{roadmap.name}</Card.Title>
                                                <div className="d-flex flex-wrap gap-1">
                                                    <Badge bg="primary">{roadmap.category}</Badge>
                                                    <Badge bg={
                                                        roadmap.difficulty === 'Beginner' ? 'success' :
                                                        roadmap.difficulty === 'Intermediate' ? 'warning' : 'danger'
                                                    }>
                                                        {roadmap.difficulty}
                                                    </Badge>
                                                    {roadmapProgress.completed && (
                                                        <Badge bg="success">
                                                            <CheckIcon className="me-1" /> Completed
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <OverlayTrigger overlay={<Tooltip>Go to roadmap</Tooltip>}>
                                            <Button variant="primary" href={`/roadmap/${roadmap._id}`}>
                                                <ArrowIcon />
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                    <Card.Text className="text-truncate" style={{ WebkitLineClamp: 3 }}>
                                        {roadmap.description}
                                    </Card.Text>
                                    <div className="mb-2">
                                        <div className="d-flex justify-content-between mb-1">
                                            <small>Progress</small>
                                            <small>{roadmapProgress.progress}%</small>
                                        </div>
                                        <ProgressBar now={roadmapProgress.progress} variant={roadmapProgress.completed ? "success" : "primary"} />
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between flex-wrap">
                                        <div className="d-flex align-items-center mb-1">
                                            <SkillIcon className="me-1" />
                                            <small className="text-secondary">{completedSkills}/{totalSkills} Skills</small>
                                        </div>
                                        <div className="d-flex align-items-center mb-1">
                                            <CalendarIcon className="me-1" />
                                            <small className="text-secondary">Started {new Date(roadmapProgress.createdAt).toLocaleDateString()}</small>
                                        </div>
                                        {roadmap.estimatedHours && (
                                            <div className="d-flex align-items-center mb-1">
                                                <TimeIcon className="me-1" />
                                                <small className="text-secondary">~{roadmap.estimatedHours} hours</small>
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Simple list view for compact display
    return (
        <ListGroup>
            {roadmaps.map((roadmapProgress, index) => {
                const roadmap = roadmapProgress.roadmap;

                return (
                    <React.Fragment key={roadmap._id}>
                        <ListGroup.Item className="d-flex justify-content-between align-items-start">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary text-white rounded-circle p-2 me-2">
                                    <RoadmapIcon />
                                </div>
                                <div>
                                    <div className="d-flex align-items-center mb-1">
                                        <strong className="me-1">{roadmap.name}</strong>
                                        {roadmapProgress.completed && (
                                            <Badge bg="success" className="d-flex align-items-center">
                                                <CheckIcon className="me-1" /> Completed
                                            </Badge>
                                        )}
                                    </div>
                                    <ProgressBar now={roadmapProgress.progress} variant={roadmapProgress.completed ? "success" : "primary"} className="mb-1" />
                                    <div className="d-flex justify-content-between">
                                        <small className="text-secondary">{roadmapProgress.progress}% complete</small>
                                        <small className="text-secondary">{roadmap.difficulty}</small>
                                    </div>
                                </div>
                            </div>
                            <Button variant="primary" href={`/roadmap/${roadmap._id}`}>
                                Continue
                            </Button>
                        </ListGroup.Item>
                        {index < roadmaps.length - 1 && <hr />}
                    </React.Fragment>
                );
            })}
        </ListGroup>
    );
};

export default RoadmapsList;
