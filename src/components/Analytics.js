import React, { useEffect, useState } from 'react';
import { fetchCategorySummary, fetchDateSummary } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = ({refreshKey }) => {
    const [categoryData, setCategoryData] = useState(null);
    const [dateData, setDateData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categorySummary = await fetchCategorySummary();
                const dateSummary = await fetchDateSummary();

                const formattedCategoryData = {
                    labels: categorySummary.map(item => item.category),
                    datasets: [
                        {
                            label: "Total Amount per Category",
                            data: categorySummary.map(item => item.totalAmount),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                };

                const formattedDateData = {
                    labels: dateSummary.map(item => new Date(item.date).toLocaleDateString()),
                    datasets: [
                        {
                            label: "Total Amount per Date",
                            data: dateSummary.map(item => item.totalAmount),
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                        },
                    ],
                };

                setCategoryData(formattedCategoryData);
                setDateData(formattedDateData);
            } catch (err) {
                setError('Failed to fetch analytics data');
            }
        };

        fetchData();
    }, [refreshKey]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Analytics</h2>
            {categoryData && (
                <div>
                    <h3>Category Summary</h3>
                    <Bar data={categoryData} redraw />
                    
                </div>
            )}
            {dateData && (
                <div>
                    <h3>Date Summary</h3>
                    <Bar data={dateData} redraw/>
                </div>
            )}
        </div>
    );
};

export default Analytics;
