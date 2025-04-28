import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import RSOMatchList from '../components/matches/matches';

const YourMatchPage: React.FC = () => {
  const [netId, setNetId] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!netId) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:3007/students/${netId}/rso-matches`);
      if (!response.ok) throw new Error('Failed to find RSO matches');
      
      const data = await response.json();
      console.log('Received data:', data); // Add debugging
      setMatches(data);
    } catch (err) {
      setError('Error finding RSO matches. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Find Your Perfect RSO Match
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Enter your NetID to get personalized RSO recommendations based on your interests.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Enter your NetID"
            value={netId}
            onChange={(e) => setNetId(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!netId || loading}
          >
            Find Matches
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : matches.length > 0 ? (
        <RSOMatchList matches={matches} />
      ) : (
        netId && !loading && (
          <Typography textAlign="center" color="text.secondary">
            No matching RSOs found. Try a different NetID.
          </Typography>
        )
      )}
    </Container>
  );
};

export default YourMatchPage;