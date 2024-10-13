// import React, { useEffect, useState } from 'react';

// function App() {
//     const [bitcoinDetails, setBitcoinDetails] = useState([]);

//     useEffect(() => {
//         fetch('http://localhost:3000/api/bitcoin-details') // Ensure the correct URL and port
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log("Fetched Bitcoin Data:", data); // Log fetched data for debugging
//                 setBitcoinDetails(data);
//             })
//             .catch(error => console.error('Error fetching data:', error));
//     }, []);

//     return (
//         <div>
//             <h1>Bitcoin Details</h1>
//             <table border="1">
//                 <thead>
//                     <tr>
//                         <th>Height</th>
//                         <th>Hash</th>
//                         <th>time</th>
//                         <th>latest_url</th>
//                         <th>previous_hash</th>
//                         <th>previous_url</th>
//                         <th>peer_count</th>
//                         <th>unconfirmed_count</th>
                        
//                         <th>high_fee_per_kb</th>
//                         <th>medium_fee_per_kb</th>
//                         <th>low_fee_per_kb</th>

//                         <th>last_fork_height</th>
//                         <th>last_fork_hash</th>
                        
                        
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {bitcoinDetails.length > 0 ? (
//                         bitcoinDetails.map((detail, index) => (
//                             <tr key={index}>
//                                 <td>{detail.height}</td>
//                                 <td>{detail.hash}</td>
//                                 <td>{detail.time}</td>
//                                 <td>{detail.latest_url}</td>
//                                 <td>{detail.previous_hash}</td>
//                                 <td>{detail.previous_url}</td>
//                                 <td>{detail.peer_count}</td>
//                                 <td>{detail.unconfirmed_count}</td>
//                                 <td>{detail.high_fee_per_kb}</td>
//                                 <td>{detail.medium_fee_per_kb}</td>
//                                 <td>{detail.low_fee_per_kb}</td>
//                                 <td>{detail.last_fork_height}</td>
//                                 <td>{detail.last_fork_hash}</td>

                                

//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="2">No Bitcoin details available</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

// export default App;



import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import BitcoinCharts from './components/BitcoinCharts';
import './App.css'; // Assuming you have some basic styles


function App() {
    const [data, setData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        const socket = io('http://localhost:3001', {
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
    
        socket.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
        });
    
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            setIsConnected(false);
        });
    
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });
    
        socket.on('bitcoin_data', (bitcoinData) => {
            console.log('Received Bitcoin data:', bitcoinData);
            setData(bitcoinData);
            setLastUpdate(new Date().toLocaleString());
        });
    
        return () => {
            console.log('Cleaning up socket connection');
            socket.off('connect');
            socket.off('disconnect');
            socket.off('bitcoin_data');
            socket.disconnect();
        };
    }, []);

    // Add the return statement to render the component
    return (
        <div className="App">
            <h1>Bitcoin Real-time Data</h1>
            <p>Connection status: <span className={isConnected ? 'connected' : 'disconnected'}>
                {isConnected ? 'Connected' : 'Disconnected'}
            </span></p>
            {lastUpdate && <p>Last updated: {lastUpdate}</p>}
            {data ? (
                <>
                    <div className="bitcoin-data">
                        <h2>Latest Block Information</h2>
                        <p>Height: {data.height}</p>
                        <p>Hash: {data.hash}</p>
                        <p>Time: {new Date(data.time).toLocaleString()}</p>
                        <p>Latest URL: <a href={data.latest_url} target="_blank" rel="noopener noreferrer">{data.latest_url}</a></p>
                        <p>Previous Hash: {data.previous_hash}</p>
                        <p>Previous URL: <a href={data.previous_url} target="_blank" rel="noopener noreferrer">{data.previous_url}</a></p>
                        
                        <h3>Network Information</h3>
                        <p>Peer Count: {data.peer_count}</p>
                        <p>Unconfirmed Count: {data.unconfirmed_count}</p>
                        
                        <h3>Fee Information (per KB)</h3>
                        <p>High Fee: {data.high_fee_per_kb}</p>
                        <p>Medium Fee: {data.medium_fee_per_kb}</p>
                        <p>Low Fee: {data.low_fee_per_kb}</p>
                        
                        <h3>Fork Information</h3>
                        <p>Last Fork Height: {data.last_fork_height}</p>
                        <p>Last Fork Hash: {data.last_fork_hash}</p>
                    </div>
                    <BitcoinCharts data={data} />
                </>
            ) : (
                <p>Waiting for Bitcoin data...</p>
            )}
        </div>
    );
}

export default App;