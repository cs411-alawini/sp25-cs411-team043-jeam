import React, {useState, useEffect} from "react";
import SearchBar from "../components/searchBar/searchBar";
import RSOList from "../components/rsoList/rsoList";
import { searchRSOData } from "../services/services";
import { RSO_Interests } from "../rso_interest";

const RSOPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [rsoData, setRSOData] = useState<RSO_Interests[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                setRSOData([]);
                const data = await searchRSOData(searchQuery);
                setRSOData(data);
            } catch (error) {
                console.error('Error fetching RSOs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
            <div className="overflow-hidden bg-white py-16 sm:py-24 shadow-sm">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto text-center mb-16">
                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                            RSO Directory
                        </h1>
                        <h2 className="text-lg font-semibold leading-8 text-indigo-600">
                            Discover Your Perfect Student Organization
                        </h2>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <SearchBar onSearch={handleSearch} />
                    <div className="mt-8">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                            </div>
                        ) : (
                            <div className="mt-6 py-8">
                                {rsoData.length > 0 ? (
                                    <RSOList RsoData={rsoData} />
                                ) : searchQuery ? (
                                    <div className="text-center text-gray-500">
                                        No RSOs found matching your search
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RSOPage;