import React, { useEffect, useState } from 'react';
import { fetchCategorySummary } from '../services/api';
import '../Layout.css';

const CategorySummary = ({ refreshKey }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchCategorySummary();
                const totalAmount = result.reduce((sum, item) => sum + Math.abs(item.totalAmount), 0);
                const dataWithPercentage = result.map((item) => ({
                    ...item,
                    percentage: ((Math.abs(item.totalAmount) / totalAmount) * 100).toFixed(2),
                }));
                setData(dataWithPercentage);
            } catch (err) {
                setError('Failed to fetch category summary');
            }
        };
        fetchData();
    }, [refreshKey]); // Lyssna på refreshKey för att uppdatera

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Category Summary</h2>
            <ul>
                {data.map((item, index) => (
                    <li key={index} className="category-row">
                        <span className="category-name">{item.category}</span>
                        <span
                            className={`category-amount ${item.totalAmount >= 0 ? 'positive' : 'negative'}`}
                        >
                            {item.totalAmount} kr
                        </span>
                        <span className="category-percentage">({item.percentage}%)</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategorySummary;
