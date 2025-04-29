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
  member_majors: string;
  common_interests: string;
}

interface ClubStatisticsProps {
  stats: ClubStats[];
}

const ClubStatistics: React.FC<ClubStatisticsProps> = ({ stats }) => {
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
              <TableCell><strong>Major Distribution</strong></TableCell>
              <TableCell><strong>Common Interests</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((club) => (
              <TableRow key={club.RSO_name}>
                <TableCell>{club.RSO_name}</TableCell>
                <TableCell align="right">{club.member_count}</TableCell>
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
                <TableCell>{club.common_interests}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ClubStatistics;