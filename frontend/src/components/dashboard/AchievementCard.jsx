// components/dashboard/AchievementCard.jsx
import React from 'react';
import { Card, ProgressBar, Badge } from 'react-bootstrap';
import { FaMedal, FaFire, FaStar, FaChartLine, FaBook, FaFlag } from 'react-icons/fa';

const AchievementCard = ({ achievement }) => {
    // Determine icon based on achievement type
    const getAchievementIcon = (type) => {
        switch (type) {
            case 'SKILLS_COUNT':
                return <FaBook />;
            case 'STREAK':
                return <FaFire />;
            case 'LEVEL':
                return <FaStar />;
            case 'POINTS':
                return <FaChartLine />;
            case 'ROADMAP_COMPLETED':
                return <FaFlag />;
            default:
                return <FaMedal />;
        }
    };

    // Get achievement description
    const getAchievementDescription = (achievement) => {
        switch (achievement.type) {
            case 'SKILLS_COUNT':
                return `Complete ${achievement.threshold} skills`;
            case 'STREAK':
                return `Maintain a ${achievement.threshold}-day streak`;
            case 'LEVEL':
                return `Reach level ${achievement.threshold}`;
            case 'POINTS':
                return `Earn ${achievement.threshold} points`;
            case 'ROADMAP_COMPLETED':
                return `Complete ${achievement.threshold} roadmaps`;
            default:
                return achievement.description;
        }
    };

    return (
        <Card className={`mb-3 ${achievement.completed ? 'border-success' : ''}`} style={{ opacity: achievement.completed ? 1 : 0.7 }}>
            <Card.Body>
                <div className="d-flex align-items-center mb-3">
                    <div className={`d-flex align-items-center justify-content-center bg-${achievement.completed ? 'success' : 'secondary'} text-white rounded-circle p-2 me-3`}>
                        {getAchievementIcon(achievement.type)}
                    </div>
                    <Card.Title className="mb-0">{achievement.name}</Card.Title>
                </div>
                
                <Card.Text className="text-muted mb-3">
                    {getAchievementDescription(achievement)}
                </Card.Text>
                
                <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted">Progress</small>
                        <small className="text-muted">{Math.round(achievement.progress)}%</small>
                    </div>
                    <ProgressBar now={achievement.progress} variant={achievement.completed ? 'success' : 'primary'} />

                </div>
                
                <div className="d-flex justify-content-between align-items-center">
                    <Badge bg={achievement.completed ? 'success' : 'secondary'}>{`+${achievement.pointsAwarded} pts`}</Badge>
                    
                    {achievement.completed && (
                        <small className="text-success fw-bold">UNLOCKED</small>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default AchievementCard;
