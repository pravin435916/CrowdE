// components/dashboard/SkillsProgressChart.jsx
import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress, 
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  School as SkillIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  NewReleases as NewIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const SkillsProgressChart = ({ skillStats }) => {
  const theme = useTheme();

  if (!skillStats) {
    return null;
  }

  // Data for pie chart
  const data = [
    { name: 'Completed', value: skillStats.completedSkills, color: theme.palette.success.main },
    { name: 'In Progress', value: skillStats.inProgressSkills, color: theme.palette.warning.main },
    { name: 'Not Started', value: skillStats.untouchedSkills, color: theme.palette.grey[400] }
  ];

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1.5, boxShadow: theme.shadows[3] }}>
          <Typography variant="body2" color="text.primary">
            {payload[0].name}: <strong>{payload[0].value}</strong> skills
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Grid container spacing={3}>
      {/* Stats cards */}
      <Grid item xs={12} md={8}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center'
              }}
              elevation={1}
            >
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <CircularProgress 
                  variant="determinate" 
                  value={100} 
                  size={60}
                  thickness={4}
                  sx={{ color: theme.palette.grey[200] }}
                />
                <CircularProgress 
                  variant="determinate" 
                  value={(skillStats.completedSkills / Math.max(1, skillStats.totalSkills)) * 100} 
                  size={60}
                  thickness={4}
                  sx={{ 
                    color: theme.palette.success.main,
                    position: 'absolute',
                    left: 0
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.secondary">
                    {skillStats.completedSkills}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                Completed Skills
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center'
              }}
              elevation={1}
            >
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <CircularProgress 
                  variant="determinate" 
                  value={100} 
                  size={60}
                  thickness={4}
                  sx={{ color: theme.palette.grey[200] }}
                />
                <CircularProgress 
                  variant="determinate" 
                  value={(skillStats.inProgressSkills / Math.max(1, skillStats.totalSkills)) * 100} 
                  size={60}
                  thickness={4}
                  sx={{ 
                    color: theme.palette.warning.main,
                    position: 'absolute',
                    left: 0
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.secondary">
                    {skillStats.inProgressSkills}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                In Progress
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center'
              }}
              elevation={1}
            >
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <CircularProgress 
                  variant="determinate" 
                  value={100} 
                  size={60}
                  thickness={4}
                  sx={{ color: theme.palette.grey[200] }}
                />
                <CircularProgress 
                  variant="determinate" 
                  value={(skillStats.untouchedSkills / Math.max(1, skillStats.totalSkills)) * 100} 
                  size={60}
                  thickness={4}
                  sx={{ 
                    color: theme.palette.grey[500],
                    position: 'absolute',
                    left: 0
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.secondary">
                    {skillStats.untouchedSkills}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                Not Started
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Paper 
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center'
              }}
              elevation={1}
            >
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <CircularProgress 
                  variant="determinate" 
                  value={100} 
                  size={60}
                  thickness={4}
                  sx={{ color: theme.palette.grey[200] }}
                />
                <CircularProgress 
                  variant="determinate" 
                  value={skillStats.averageProgress} 
                  size={60}
                  thickness={4}
                  sx={{ 
                    color: theme.palette.primary.main,
                    position: 'absolute',
                    left: 0
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.secondary">
                    {Math.round(skillStats.averageProgress)}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                Average Progress
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Completion rate */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Overall Completion Rate</Typography>
            <Typography variant="body2" fontWeight="medium">
              {Math.round(skillStats.completionRate)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={skillStats.completionRate} 
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CompletedIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {skillStats.completedSkills} Completed
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PendingIcon color="warning" fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {skillStats.inProgressSkills} In Progress
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NewIcon color="disabled" fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {skillStats.untouchedSkills} Not Started
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      
      {/* Pie chart */}
      <Grid item xs={12} md={4}>
        <Paper 
          sx={{ 
            p: 2, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center'
          }}
          elevation={1}
        >
          <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
            Skills Distribution
          </Typography>
          
          <Box sx={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                    // Only show label if the value is > 0
                    if (value === 0) return null;
                    
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill={data[index].color}
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        {value}
                      </text>
                    );
                  }}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', mt: 2 }}>
            {data.map((entry) => (
              <Box 
                key={entry.name} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  opacity: entry.value === 0 ? 0.5 : 1
                }}
              >
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: entry.color,
                    mr: 0.5
                  }} 
                />
                <Typography variant="caption" color="text.secondary">
                  {entry.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SkillsProgressChart;