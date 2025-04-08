import React from "react";
import { Students } from "../../students";
import { Link } from "react-router-dom";

interface StudentListProps {
  StudentsData: Students[];
}

const StudentsList: React.FC<StudentListProps> = ({ StudentsData }) => {
  return (
    <ul className="divide-y divide-gray-200">
      {StudentsData.map((Students) => (
        <li key={Students.netId} className="flex py-4">
          <div className="ml-3 py-5">
            <p className="text-xl font-medium text-gray-900">
              {Students.name}
            </p>
            <p className="text-xl font-medium text-gray-900">
              {Students.netId}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default StudentsList;
