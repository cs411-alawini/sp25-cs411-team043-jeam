import React from 'react';
import { Students } from '../../students';
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Stack,
    Chip,
    Button,
    Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface StudentListProps {
    StudentsData: Students[];
    onDeleteStudent: (netId: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ StudentsData, onDeleteStudent }) => {
    const handleDelete = async (netId: string) => {
        try {
            await fetch(`http://localhost:3007/students/${netId}`, {
                method: 'DELETE',
            });
            onDeleteStudent(netId);
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    return (
        <Stack spacing={2}>
            {StudentsData.map((student, index) => (
                <Card 
                    key={student.netId || index}
                    sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" color="primary">
                                {student.name}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDelete(student.netId)}
                                size="small"
                            >
                                Delete
                            </Button>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                            <Chip
                                label={`NetID: ${student.netId}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                            <Chip
                                label={`Major: ${student.major}`}
                                size="small"
                                sx={{ bgcolor: '#f5f5f5' }}
                            />
                            {student.minor && student.minor !== 'NA' && (
                                <Chip
                                    label={`Minor: ${student.minor}`}
                                    size="small"
                                    sx={{ bgcolor: '#f5f5f5' }}
                                />
                            )}
                            <Chip
                                label={`Year: ${student.year}`}
                                size="small"
                                sx={{ bgcolor: '#f5f5f5' }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
};

export default StudentList;