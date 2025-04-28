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

interface ClubStats {
  RSO_name: string;
  member_count: number;
  avg_member_year: string | number; // Updated type to handle both string and number
  member_majors: string;
  common_interests: string;
}

interface ClubStatisticsProps {
  stats: ClubStats[];
}

const ClubStatistics: React.FC<ClubStatisticsProps> = ({ stats }) => {
  const formatAvgYear = (avg: string | number): string => {
    const numValue = typeof avg === 'string' ? parseFloat(avg) : avg;
    return Number.isNaN(numValue) ? 'N/A' : numValue.toFixed(1);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Club Membership Statistics
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Club Name</strong></TableCell>
              <TableCell align="right"><strong>Members</strong></TableCell>
              <TableCell align="right"><strong>Avg. Year</strong></TableCell>
              <TableCell><strong>Major Distribution</strong></TableCell>
              <TableCell><strong>Common Interests</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((club) => (
              <TableRow key={club.RSO_name}>
                <TableCell>{club.RSO_name}</TableCell>
                <TableCell align="right">{club.member_count}</TableCell>
                <TableCell align="right">{formatAvgYear(club.avg_member_year)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {(club.member_majors || '').split(',').map((major, idx) => (
                      <Chip 
                        key={idx} 
                        label={major.trim()} 
                        size="small" 
                        sx={{ bgcolor: '#f5f5f5' }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {(club.common_interests || '').split(',').map((interest, idx) => (
                      <Chip 
                        key={idx} 
                        label={interest.trim()} 
                        size="small" 
                        variant="outlined" 
                        color="primary"
                      />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ClubStatistics;