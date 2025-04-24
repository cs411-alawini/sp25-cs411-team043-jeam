import React from "react";
import { RSO_Interests } from "../../rso_interest";
import { Link } from "react-router-dom";

interface RsoListProps {
  RsoData: RSO_Interests[];
}

const RSOList: React.FC<RsoListProps> = ({ RsoData }) => {
  return (
    <ul className="divide-y divide-gray-200">
      {RsoData.map((RSO_Interests) => (
        <li key={RSO_Interests.RSOname} className="flex py-4">
        <div className="ml-3 py-5">
          <p className="text-xl font-semibold text-gray-900">
            {RSO_Interests.RSOname}
          </p>
          <p className="text-md text-gray-700">{RSO_Interests.RSOInterest1}</p>
          <p className="text-md text-gray-700">{RSO_Interests.RSOInterest2}</p>
          <p className="text-md text-gray-700">{RSO_Interests.RSOInterest3}</p>
        </div>
      </li>
      ))}
    </ul>
  );
};

export default RSOList;
