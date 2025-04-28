import React from 'react';
import { RSO_Interests } from '../../rso_interest';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Stack,
  Chip
} from '@mui/material';

interface RSOListProps {
  RsoData: RSO_Interests[];
}

const RSOList: React.FC<RSOListProps> = ({ RsoData }) => {
  return (
    <Stack spacing={2}>
      {RsoData.map((rso, index) => (
        <Card 
          key={rso.RSOInterestId || index}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              {rso.RSOname}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[rso.RSOInterest1, rso.RSOInterest2, rso.RSOInterest3]
                .filter(interest => interest && interest !== 'NA')
                .map((interest, idx) => (
                  <Chip
                    key={idx}
                    label={interest}
                    size="small"
                    sx={{ bgcolor: '#f5f5f5' }}
                  />
                ))}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default RSOList;