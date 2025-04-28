import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip
} from '@mui/material';

interface RSOMatch {
  RSOName: string;
  department: string;
  taggedPref: string;
  current_members: number;
  rso_interests: string;
  interest_match_score: number;
}

interface RSOMatchListProps {
  matches: RSOMatch[];
}

const RSOMatchList: React.FC<RSOMatchListProps> = ({ matches }) => {
  console.log('Received matches:', matches); // Add debugging

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>RSO Name</strong></TableCell>
            <TableCell><strong>Department</strong></TableCell>
            <TableCell><strong>Interest Score</strong></TableCell>
            <TableCell><strong>Members</strong></TableCell>
            <TableCell><strong>Interests</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matches && matches.map((match) => (
            <TableRow key={match.RSOName}>
              <TableCell>{match.RSOName}</TableCell>
              <TableCell>{match.department}</TableCell>
              <TableCell>{match.interest_match_score}</TableCell>
              <TableCell>{match.current_members || 0}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {match.rso_interests?.split(',').map((interest, idx) => (
                    <Chip
                      key={idx}
                      label={interest.trim()}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ display: interest.trim() === 'NA' ? 'none' : 'flex' }}
                    />
                  ))}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RSOMatchList;