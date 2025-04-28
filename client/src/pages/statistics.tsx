import React, { useState, useEffect } from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import ClubStatistics from '../components/statistics/statistics';

const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3007/students/stats/club-membership');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <ClubStatistics stats={stats} />
        )}
      </Box>
    </Container>
  );
};

export default StatisticsPage;