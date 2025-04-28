import React from 'react';
import { Tabs, Tab, Box, AppBar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const TabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={location.pathname}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="RSOs" value="/rsos" />
          <Tab label="Students" value="/students" />
          <Tab label="Statistics" value="/statistics" />
          <Tab label="Find a Friend" value="/find-friend" />
          <Tab label="Your Match" value="/your-match" />
        </Tabs>
      </Box>
    </AppBar>
  );
};

export default TabNavigation;