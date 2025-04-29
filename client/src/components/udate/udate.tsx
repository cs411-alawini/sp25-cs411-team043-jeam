import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar
} from '@mui/material';

const UpdateRSOInterest: React.FC = () => {
  const [rsoName, setRsoName] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3007/rsos/${rsoName}/interest`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newInterest }),
      });

      if (!response.ok) {
        throw new Error('Failed to update RSO interest');
      }

      setMessage('RSO interest updated successfully');
      setRsoName('');
      setNewInterest('');
    } catch (error) {
      setError('Failed to update RSO interest');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Update RSO Interest
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="RSO Name"
            value={rsoName}
            onChange={(e) => setRsoName(e.target.value)}
            required
          />
          <TextField
            label="New Interest"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Update Interest
          </Button>
        </Box>
      </form>
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
      >
        <Alert severity="success">{message}</Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default UpdateRSOInterest;