import React, { useEffect, useState } from 'react';

function App() {
    const [bitcoinDetails, setBitcoinDetails] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/bitcoin-details') // Ensure the correct URL and port
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched Bitcoin Data:", data); // Log fetched data for debugging
                setBitcoinDetails(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Bitcoin Details</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Height</th>
                        <th>Hash</th>
                    </tr>
                </thead>
                <tbody>
                    {bitcoinDetails.length > 0 ? (
                        bitcoinDetails.map((detail, index) => (
                            <tr key={index}>
                                <td>{detail.height}</td>
                                <td>{detail.hash}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">No Bitcoin details available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default App;
