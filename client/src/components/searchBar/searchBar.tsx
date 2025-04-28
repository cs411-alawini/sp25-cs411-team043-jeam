import React, { useState } from 'react';
import { 
  TextField, 
  Container, 
  Typography, 
  Box,
  InputAdornment,
  Paper,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = () => {
    onSearch(searchQuery);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#1976d2' }}>
          Search
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ minWidth: '120px' }}
          >
            Search
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SearchBar;