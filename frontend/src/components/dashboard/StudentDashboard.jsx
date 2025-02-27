// components/dashboard/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import SkillsProgressChart from './SkillsProgressChart';
// import LeaderboardPanel from './LeaderboardPanel';
import SkillsFlowChart from '../SkillsFlowChart';

const StudentDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [skillsFlowData, setSkillsFlowData] = useState({ nodes: [], edges: [] });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/student/dashboard');
                setDashboardData(response.data);
                generateSkillsFlowData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load dashboard data');
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const generateSkillsFlowData = (data) => {
        if (!data || !data.skillStats) return;

        const nodes = [];
        const edges = [];

        nodes.push({
            id: 'skills-hub',
            type: 'skillsHubNode',
            position: { x: 250, y: 150 },
            data: { label: 'My Skills' }
        });

        const skillsByCategory = {};
        data.skillStats.skills.forEach(skill => {
            if (!skillsByCategory[skill.category]) {
                skillsByCategory[skill.category] = [];
            }
            skillsByCategory[skill.category].push(skill);
        });

        Object.keys(skillsByCategory).forEach((category, categoryIndex) => {
            const categoryId = `category-${categoryIndex}`;
            const angle = (2 * Math.PI * categoryIndex) / Object.keys(skillsByCategory).length;
            const x = 250 + Math.cos(angle) * 200;
            const y = 150 + Math.sin(angle) * 200;

            nodes.push({
                id: categoryId,
                type: 'careerNode',
                position: { x, y },
                data: { 
                    label: category,
                    description: `${skillsByCategory[category].length} skills`
                }
            });

            edges.push({
                id: `edge-hub-to-${categoryId}`,
                source: 'skills-hub',
                target: categoryId,
                animated: true,
                style: { stroke: '#6366f1' }
            });

            skillsByCategory[category].forEach((skill, skillIndex) => {
                const skillId = `skill-${skill._id}`;
                const skillAngle = angle - Math.PI/4 + (Math.PI/2 * skillIndex) / skillsByCategory[category].length;
                const skillX = x + Math.cos(skillAngle) * 150;
                const skillY = y + Math.sin(skillAngle) * 150;

                const nodeType = skill.progress === 100 
                    ? 'existingSkillNode' 
                    : skill.progress > 0 
                        ? 'learningSkillNode' 
                        : 'default';

                nodes.push({
                    id: skillId,
                    type: nodeType,
                    position: { x: skillX, y: skillY },
                    data: { label: skill.name }
                });

                edges.push({
                    id: `edge-${categoryId}-to-${skillId}`,
                    source: categoryId,
                    target: skillId,
                    style: { 
                        stroke: skill.progress === 100 
                            ? '#22c55e' 
                            : skill.progress > 0 
                                ? '#f59e0b' 
                                : '#94a3b8' 
                    }
                });
            });
        });

        setSkillsFlowData({ nodes, edges });
    };

    const handleTabChange = (newValue) => {
        setActiveTab(newValue);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '16px', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    if (!dashboardData) return null;

    const { student, gamification, skillStats, achievements, recentActivity } = dashboardData;

    return (
        <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', marginBottom: '16px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <img src={student.avatar} alt={student.name} style={{ width: '80px', height: '80px', marginRight: '16px', borderRadius: '50%' }} />
                    <div>
                        <h2>{student.name}</h2>
                        <p>Joined {new Date(student.joinDate).toLocaleDateString()}</p>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                            <span style={{ marginRight: '8px', padding: '4px 8px', backgroundColor: '#1976d2', color: 'white', borderRadius: '4px' }}>
                                Level {gamification.level}
                            </span>
                            <span style={{ padding: '4px 8px', backgroundColor: '#d32f2f', color: 'white', borderRadius: '4px' }}>
                                {gamification.streak} Day Streak
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{ flex: 1 }}></div>
                    <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h3>Experience</h3>
                            <p>{gamification.experience} / {gamification.experienceToNextLevel}</p>
                        </div>
                        <div style={{ height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' }}></div>
                            <div style={{ width: `${(gamification.experience / gamification.experienceToNextLevel) * 100}%`, height: '100%', backgroundColor: '#1976d2' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <h4>{gamification.points}</h4>
                                <p>Points</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h4>{skillStats.completedSkills}</h4>
                                <p>Skills</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h4>{gamification.rank}</h4>
                                <p>Rank</p>
                            </div>
                        </div>
                    </div>
            <div style={{ borderBottom: '1px solid #e0e0e0', marginBottom: '16px' }}>
                <div style={{ display: 'flex', overflowX: 'auto' }}>
                    <button onClick={() => handleTabChange(0)} style={{ flex: '1', padding: '8px', border: 'none', backgroundColor: activeTab === 0 ? '#1976d2' : 'transparent', color: activeTab === 0 ? 'white' : 'black' }}>Overview</button>
                    <button onClick={() => handleTabChange(1)} style={{ flex: '1', padding: '8px', border: 'none', backgroundColor: activeTab === 1 ? '#1976d2' : 'transparent', color: activeTab === 1 ? 'white' : 'black' }}>Skills</button>
                    <button onClick={() => handleTabChange(2)} style={{ flex: '1', padding: '8px', border: 'none', backgroundColor: activeTab === 2 ? '#1976d2' : 'transparent', color: activeTab === 2 ? 'white' : 'black' }}>Roadmaps</button>
                    <button onClick={() => handleTabChange(3)} style={{ flex: '1', padding: '8px', border: 'none', backgroundColor: activeTab === 3 ? '#1976d2' : 'transparent', color: activeTab === 3 ? 'white' : 'black' }}>Achievements</button>
                    <button onClick={() => handleTabChange(4)} style={{ flex: '1', padding: '8px', border: 'none', backgroundColor: activeTab === 4 ? '#1976d2' : 'transparent', color: activeTab === 4 ? 'white' : 'black' }}>Stats</button>
                </div>
            </div>

            <div hidden={activeTab !== 0}>
                {activeTab === 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ flex: '1', minWidth: '300px' }}>
                            <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '16px' }}>
                                <h3>Recent Activity</h3>
                                {/* <ActivityFeed activities={recentActivity} /> */}
                            </div>
                            <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                                <h3>Active Roadmaps</h3>
                                {/* {roadmapProgress.length > 0 ? (
                                    <RoadmapsList roadmaps={roadmapProgress} />
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '24px' }}>
                                        <p>You haven't started any roadmaps yet</p>
                                        <button onClick={() => window.location.href = '/roadmaps'}>Browse Roadmaps</button>
                                    </div>
                                )} */}
                            </div>
                        </div>
                        <div style={{ flex: '1', minWidth: '300px' }}>
                            <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '16px' }}>
                                <h3>Leaderboard</h3>
                                <LeaderboardPanel />
                            </div>
                            <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                                <h3>Recent Achievements</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {achievements.filter(a => a.completed).slice(0, 4).map(achievement => (
                                        <span key={achievement._id} style={{ padding: '4px 8px', border: '1px solid #22c55e', borderRadius: '4px', color: '#22c55e' }}>
                                            {achievement.name}
                                        </span>
                                    ))}
                                    {achievements.filter(a => a.completed).length === 0 && (
                                        <p>No achievements unlocked yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div hidden={activeTab !== 1}>
                {activeTab === 1 && (
                    <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                        <h3>Skills Overview</h3>
                        <p>You have completed {skillStats.completedSkills} of {skillStats.totalSkills} skills ({Math.round(skillStats.completionRate)}% completion rate)</p>
                        <div style={{ marginBottom: '16px' }}>
                            {/* <SkillsProgressChart skillStats={skillStats} /> */}
                        </div>
                        <hr />
                        <h3>Skills Visualization</h3>
                        <div style={{ height: '600px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                            <SkillsFlowChart nodes={skillsFlowData.nodes} edges={skillsFlowData.edges} />
                        </div>
                    </div>
                )}
            </div>

            <div hidden={activeTab !== 2}>
                {activeTab === 2 && (
                    <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                        <h3>Your Roadmaps</h3>
                        {/* {roadmapProgress.length > 0 ? (
                            <RoadmapsList roadmaps={roadmapProgress} detailed />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p>You haven't started any roadmaps yet</p>
                                <p>Follow a structured learning path to master related skills</p>
                                <button onClick={() => window.location.href = '/roadmaps'}>Browse Roadmaps</button>
                            </div>
                        )} */}
                    </div>
                )}
            </div>

            <div hidden={activeTab !== 3}>
                {activeTab === 3 && (
                    <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                        <h3>Achievements</h3>
                        {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                            {achievements.map(achievement => (
                                <div key={achievement._id} style={{ flex: '1 1 calc(33.333% - 16px)', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                                    <AchievementCard achievement={achievement} />
                                </div>
                            ))}
                        </div> */}
                    </div>
                )}
            </div>

            <div hidden={activeTab !== 4}>
                {activeTab === 4 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ flex: '1', minWidth: '300px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                            <h3>Activity Stats</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div>
                                    <h4>{gamification.streak}</h4>
                                    <p>Current Streak</p>
                                </div>
                                <div>
                                    <h4>{recentActivity.filter(a => new Date(a.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</h4>
                                    <p>Activities This Week</p>
                                </div>
                                <div>
                                    <h4>{recentActivity.filter(a => a.type === 'SKILL_COMPLETED').length}</h4>
                                    <p>Skills Completed</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: '1', minWidth: '300px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                            <h3>Gamification Stats</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div>
                                    <h4>{gamification.level}</h4>
                                    <p>Current Level</p>
                                </div>
                                <div>
                                    <h4>{gamification.points}</h4>
                                    <p>Total Points</p>
                                </div>
                                <div>
                                    <h4>{achievements.filter(a => a.completed).length}</h4>
                                    <p>Achievements</p>
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <p>Experience to Level {gamification.level + 1}</p>
                                <div style={{ height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' }}></div>
                                    <div style={{ width: `${(gamification.experience / gamification.experienceToNextLevel) * 100}%`, height: '100%', backgroundColor: '#1976d2' }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}></div>
                                    <p>{gamification.experience} XP</p>
                                    <p>{gamification.experienceToNextLevel} XP</p>
                               
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
