import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Stack
} from '@mui/material';
import { Students } from '../../students';

interface AddStudentFormProps {
  onStudentAdded: (student: Students) => void;
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    netId: '',
    name: '',
    year: '',
    minor: '',
    major: '',
    taggedPref: '',
    prefTimeComm: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3007/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create student');
      }

      const newStudent = await response.json();
      onStudentAdded(newStudent);
      
      // Reset form
      setFormData({
        netId: '',
        name: '',
        year: '',
        minor: '',
        major: '',
        taggedPref: '',
        prefTimeComm: ''
      });
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Student
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            required
            label="NetID"
            value={formData.netId}
            onChange={(e) => setFormData({ ...formData, netId: e.target.value })}
          />
          <TextField
            required
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            required
            label="Year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
          <TextField
            label="Minor"
            value={formData.minor}
            onChange={(e) => setFormData({ ...formData, minor: e.target.value })}
          />
          <TextField
            required
            label="Major"
            value={formData.major}
            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
          />
          <TextField
            label="Tagged Preference"
            value={formData.taggedPref}
            onChange={(e) => setFormData({ ...formData, taggedPref: e.target.value })}
          />
          <TextField
            label="Preferred Time Commitment"
            value={formData.prefTimeComm}
            onChange={(e) => setFormData({ ...formData, prefTimeComm: e.target.value })}
          />
          <Button type="submit" variant="contained" color="primary">
            Create Profile
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default AddStudentForm;