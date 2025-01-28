import { useState, useEffect } from "react";
import { createTransaction, fetchCategories } from "../services/api";
import { apiClient } from "../services/api";

const AddTransaction = ({ onTransactionAdded }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchCategories();
                setCategories(result);
            } catch (err) {
                setError('Failed to fetch categories');
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let categoryId = categories.find((c) => c.name === selectedCategory)?.id;

            if (!categoryId && newCategory.trim() !== "") {
                const newCategoryResponse = await apiClient.post('/Category', { name: newCategory });
                categoryId = newCategoryResponse.data.id;

                // Uppdatera kategorilistan
                const updatedCategories = await fetchCategories();
                setCategories(updatedCategories);
            }

            if (!categoryId) {
                throw new Error("Kategori måste anges.");
            }

            const transaction = {
                title,
                amount: parseFloat(amount),
                date,
                categoryId,
            };

            const newTransaction = await createTransaction(transaction);

            // Återställ formuläret
            setTitle('');
            setAmount('');
            setDate('');
            setSelectedCategory('');
            setNewCategory('');

            if (onTransactionAdded) {
                onTransactionAdded(newTransaction);
            }
        } catch (err) {
            setError('Failed to add transaction');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-transaction-form">
            <h2>Add Transaction</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Category:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">--Select category--</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Or enter a new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
            </div>
            <button type="submit" className="submit-button">Add Transaction</button>
        </form>
    );
};

export default AddTransaction;
