// components/dashboard/LeaderboardPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaderboardPanel = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/student/leaderboard');
                setLeaderboard(response.data);
            } catch (err) {
                setError('Failed to load leaderboard');
                console.error('Leaderboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    // Render rank badge based on position
    const getRankBadge = (position) => {
        switch (position) {
            case 0:
                return <span className="badge gold">1</span>;
            case 1:
                return <span className="badge silver">2</span>;
            case 2:
                return <span className="badge bronze">3</span>;
            default:
                return <span className="badge">{position + 1}</span>;
        }
    };

    if (loading) {
        return (
            <ul className="leaderboard">
                {[...Array(5)].map((_, index) => (
                    <li key={index} className="leaderboard-item">
                        <div className="avatar skeleton"></div>
                        <div className="text skeleton"></div>
                        <div className="points skeleton"></div>
                    </li>
                ))}
            </ul>
        );
    }

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
            </div>
        );
    }

    if (leaderboard.length === 0) {
        return (
            <div className="no-data">
                <p>No leaderboard data available</p>
            </div>
        );
    }

    return (
        <ul className="leaderboard">
            {leaderboard.map((student, index) => (
                <li key={student._id} className={`leaderboard-item ${index < 3 ? 'top-rank' : ''}`}>
                    <div className="avatar-container">
                        <img src={student.avatar} alt={student.name} className="avatar" />
                        <div className="rank-badge">{getRankBadge(index)}</div>
                    </div>
                    <div className="text">
                        <p className="name">{student.name}</p>
                        <div className="details">
                            <span className="level">Level {student.level}</span>
                            {student.streak > 0 && <span className="streak">{student.streak} day streak</span>}
                        </div>
                    </div>
                    <div className="points">
                        <span className="points-value">{student.points}</span> pts
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default LeaderboardPanel;
