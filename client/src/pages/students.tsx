import React, {useState, useEffect} from "react";
import { Box } from "@mui/material";
import SearchBar from "../components/searchBar/searchBar";
import StudentList from "../components/studentList/studentList";
import { searchStudentData } from "../services/services";
import { Students } from "../students";
import AddStudentForm from '../components/AddStudentFormProps/AddStudentFormProps';

const StudentPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [studentData, setStudentData] = useState<Students[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add this useEffect hook to load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await searchStudentData("");
        setStudentData(data);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []); // Empty dependency array means this runs once when component mounts


  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    try {
      const data = await searchStudentData(query);
      setStudentData(data);
    } catch (error) {
      console.error('Error searching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = (deletedNetId: string) => {
    setStudentData(prevData => prevData.filter(student => student.netId !== deletedNetId));
  };

  const handleDelete = async (netId: string) => {
    try {
        const response = await fetch(`http://localhost:3007/students/${netId}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete student');
        }
        
        const data = await response.json();
        if (data.message === 'Student deleted successfully') {
            handleDeleteStudent(netId);
        }
    } catch (error) {
        console.error('Error deleting student:', error);
    }
  };


  const handleStudentAdded = async (newStudent: Students) => {
    setStudentData(prevData => [...prevData, newStudent]);
    // Refresh the full list to ensure we have the latest data
    const data = await searchStudentData("");
    setStudentData(data);
  };

  return (
    <>
      <div className="overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              Student Directory
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-12 lg:px-8">
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <SearchBar onSearch={handleSearch} />
            <StudentList 
              StudentsData={studentData} 
              onDeleteStudent={handleDeleteStudent}
            />
          </Box>
          <Box sx={{ width: '400px' }}>
            <AddStudentForm onStudentAdded={handleStudentAdded} />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default StudentPage;