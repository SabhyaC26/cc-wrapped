import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import './App.css';

function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/data.json')
            .then(res => {
                if (!res.ok) throw new Error('Data not found. Run command again.');
                return res.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                // Fallback for demo/dev if file missing
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading">Initializing Neural Link...</div>;
    if (error) return <div className="error">ERROR: {error}</div>;

    return (
        <div className="app-container">
            <Terminal data={data} />
        </div>
    );
}

export default App;
