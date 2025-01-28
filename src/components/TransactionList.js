import React, { useState } from 'react';
import '../Layout.css';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editValues, setEditValues] = useState({});

    const startEdit = (transaction) => {
        setEditingTransaction(transaction.id);
        setEditValues({ ...transaction });
    };

    const saveEdit = () => {
        if (onEdit) {
            onEdit(editValues); // Skickar redigerad transaktion till App.js
        }
        setEditingTransaction(null); // Avsluta redigering
    };

    const cancelEdit = () => {
        setEditingTransaction(null); // Avsluta redigering utan att spara
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditValues((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <h2>Transaction History</h2>
            <div className="transaction-history">
                <ul>
                    {transactions
                        .slice() // Skapa en kopia för att inte mutera original-arrayen
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sortera efter datum (senaste först)
                        .map((transaction) => (
                            <li key={transaction.id} className="transaction-row">
                                {editingTransaction === transaction.id ? (
                                    <div className="transaction-details">
                                        <input
                                            type="text"
                                            name="title"
                                            value={editValues.title}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="number"
                                            name="amount"
                                            value={editValues.amount}
                                            onChange={handleInputChange}
                                        />
                                        <input
                                            type="date"
                                            name="date"
                                            value={editValues.date}
                                            onChange={handleInputChange}
                                        />
                                        <div className="transaction-actions">
                                            <button onClick={saveEdit}>Save</button>
                                            <button onClick={cancelEdit}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="transaction-details">
                                        <span className="transaction-title">{transaction.title}</span>
                                        <span
                                            className={`transaction-amount ${transaction.amount >= 0 ? 'positive' : ''}`}
                                        >
                                            {transaction.amount} kr
                                        </span>
                                        <span className="transaction-date">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </span>
                                        <div className="transaction-actions">
                                            <button onClick={() => startEdit(transaction)}>Edit</button>
                                            <button onClick={() => onDelete(transaction.id)}>Delete</button> {/* Borttagningsknapp */}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default TransactionList;
