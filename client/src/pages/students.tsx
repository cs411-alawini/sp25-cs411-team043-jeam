import React, {useState, useEffect} from "react";
import SearchBar from "../components/searchBar/searchBar";
import StudentList from "../components/studentList/studentList";

import { searchStudentData } from "../services/services";
import { Students } from "../students";

const StudentPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [studentData, setStudentData] = useState<Students[]>([]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // useEffect to fetch data based on search query
    useEffect(() => {
    const fetchData = async () => {
        setStudentData([]);
        const data = await searchStudentData(searchQuery);
        setStudentData(data);
    };

    fetchData();
    }, [searchQuery]); // Trigger effect whenever the search query changes

  return (
    <>
      <div className="overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"> All Students </h1>
              <h2 className="text-base font-semibold leading-7 text-indigo-600"> Hi students </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-12 lg:px-8">
        <SearchBar onSearch = {handleSearch} />
        <div className="mt-6 py-10 sm:py-15">
          <StudentList StudentsData={studentData} />
        </div>
      </div>
    </>
  );
};

export default StudentPage;
