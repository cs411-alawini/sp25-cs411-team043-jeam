import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface SimilarStudent {
  netId: string;
  name: string;
  year: number;
  major: string;
  minor: string;
  interests: string;
  match_count: number;
}

const FindFriendPage: React.FC = () => {
  const [netId, setNetId] = useState('');
  const [students, setStudents] = useState<SimilarStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!netId.trim()) {
      setError('Please enter a NetID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:3007/students/${netId}/similar`);
      if (!response.ok) throw new Error('Failed to find students');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError('Error finding students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Find Students With Similar Interests
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Enter NetID"
            value={netId}
            onChange={(e) => setNetId(e.target.value)}
            error={!!error}
            helperText={error}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!netId || loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : students.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>NetID</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Major</TableCell>
                <TableCell>Interests</TableCell>
                <TableCell>Shared Interests</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.netId}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.netId}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.major}</TableCell>
                  <TableCell>{student.interests}</TableCell>
                  <TableCell>{student.match_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : netId && !loading && (
        <Typography textAlign="center" color="text.secondary">
          No students found with similar interests.
        </Typography>
      )}
    </Container>
  );
};

export default FindFriendPage;