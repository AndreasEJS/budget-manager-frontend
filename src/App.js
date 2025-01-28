import './Layout.css';
import CategorySummary from './components/CategorySummary';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';
import Analytics from './components/Analytics';
import { useEffect, useState } from 'react';
import { fetchTransactions, updateTransaction, deleteTransaction } from './services/api';

function App() {
    const [transactions, setTransactions] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    

    const fetchAllTransactions = async () => {
        const data = await fetchTransactions();
        setTransactions(data);
    };

    const handleTransactionAdded = () => {
        setRefreshKey((prevKey) => prevKey + 1);
        fetchAllTransactions();
    };

    const handleEditTransaction = async (editedTransaction) => {
        try {
            await updateTransaction(editedTransaction); // Uppdatera transaktionen via API
            setRefreshKey((prevKey) => prevKey + 1); // Uppdatera refreshKey för att trigga ny fetch
            fetchAllTransactions(); // Hämta uppdaterade transaktioner
        } catch (error) {
            console.error("Failed to edit transaction:", error);
        }
    };
    const handleDeleteTransaction = async (transactionId) => {
        try {
            await deleteTransaction(transactionId); // Ta bort transaktionen via API
            setRefreshKey((prevKey) => prevKey + 1); // Trigga omrendering för alla komponenter
            fetchAllTransactions(); // Uppdatera transaktionslistan
        } catch (error) {
            console.error("Failed to delete transaction:", error);
        }
    };

    useEffect(() => {
        fetchAllTransactions();
    }, []);

    return (
        <div className="App">
            <header>
                <h1>Svedbucks</h1>
            </header>
            <main>
                <div className="flex-container">
                    <div className="column">
                        <CategorySummary refreshKey={refreshKey} />
                    </div>
                    <div className="column">
                        <AddTransaction onTransactionAdded={handleTransactionAdded} />
                    </div>
                </div>
                <div className="section">
                    <TransactionList
                        transactions={transactions}
                        onEdit={handleEditTransaction} // Skickar redigeringsfunktionen som prop
                        onDelete={handleDeleteTransaction}
                    />
                </div>
                <div className="section">
                    <Analytics refreshKey={refreshKey} />
                </div>
            </main>
        </div>
    );
}

export default App;
