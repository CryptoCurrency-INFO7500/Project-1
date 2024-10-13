import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ChartTitle, Tooltip, Legend);

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ContentWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 30px;
  width: 90%;
  max-width: 1200px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.5);
  }
`;

const StyledTitle = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 5px;
  font-size: 2.5rem;
  letter-spacing: 1px;
`;

const Subtitle = styled.h2`
  color: #666;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 10px;
  font-weight: 400;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background-color: #3498db;
  color: white;
  font-weight: 600;
  padding: 15px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s ease;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f8f8;
  }
  &:hover {
    background-color: #e8f4fd;
  }
  &:last-child td {
    border-bottom: none;
  }
`;

const ChartContainer = styled.div`
  margin-top: 20px;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 15px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 20px;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 15px;
  margin-bottom: 15px;
  width: calc(33% - 10px);
`;

const CardTitle = styled.h3`
  color: #333;
  margin-bottom: 10px;
`;

const CardValue = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #3498db;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 10px;

  &:hover {
    background-color: #2980b9;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

function App() {
  const [bitcoinDetails, setBitcoinDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('home');

  useEffect(() => {
    fetch('http://localhost:3000/api/historical')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched Bitcoin Data:", data);
        setBitcoinDetails(data.reverse());
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const priceData = {
    labels: bitcoinDetails.map(detail => new Date(detail.time).toLocaleDateString()),
    datasets: [{
      label: 'Bitcoin Price (USD)',
      data: bitcoinDetails.map(detail => detail.price),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const blockHeightData = {
    labels: bitcoinDetails.map(detail => new Date(detail.time).toLocaleDateString()),
    datasets: [{
      label: 'Block Height',
      data: bitcoinDetails.map(detail => detail.height),
      backgroundColor: 'rgb(255, 99, 132)',
    }]
  };

  const feeData = {
    labels: bitcoinDetails.map(detail => new Date(detail.time).toLocaleDateString()),
    datasets: [
      {
        label: 'High Fee per KB',
        data: bitcoinDetails.map(detail => detail.high_fee_per_kb),
        borderColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Medium Fee per KB',
        data: bitcoinDetails.map(detail => detail.medium_fee_per_kb),
        borderColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Low Fee per KB',
        data: bitcoinDetails.map(detail => detail.low_fee_per_kb),
        borderColor: 'rgb(255, 205, 86)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Bitcoin Metrics' },
    },
  };

  if (isLoading) return <AppContainer><ContentWrapper><StyledTitle>Loading...</StyledTitle></ContentWrapper></AppContainer>;
  if (error) return <AppContainer><ContentWrapper><StyledTitle>Error: {error}</StyledTitle></ContentWrapper></AppContainer>;

  const latestData = bitcoinDetails[bitcoinDetails.length - 1];

  const renderHome = () => (
    <>
      <StyledTitle>Project: Bitcoin Explorer</StyledTitle>
      <Subtitle>Team: Akshatha Patil, Sumanayana Konda, Ruthwik BG</Subtitle>
      <Subtitle>Tools Used: React, NodeJs, PostgreSQL and Rust</Subtitle>
      
      <Section>
        <h2>Project Details</h2>
        <p>This Bitcoin Explorer provides real-time data visualization and analysis of both on-chain and off-chain metrics. It continuously ingests data from the Bitcoin network and presents it through an interactive user interface.</p>
      </Section>

      <Section>
        <h2>On-Chain Metrics</h2>
        <p>On-chain metrics are data points derived directly from the Bitcoin blockchain. In this project, we track:</p>
        <ul>
          <li><strong>Block Height:</strong> The number of blocks in the blockchain, indicating the chain's current length.</li>
          <li><strong>Block Hash:</strong> A unique identifier for each block in the chain.</li>
          <li><strong>Transaction Fees:</strong> The cost of including transactions in blocks, categorized as high, medium, and low.</li>
        </ul>
      </Section>

      <Section>
        <h2>Off-Chain Metrics</h2>
        <p>Off-chain metrics are data points not directly stored on the blockchain but related to the Bitcoin network. We monitor:</p>
        <ul>
          <li><strong>Price:</strong> The current market value of Bitcoin in USD.</li>
          <li><strong>Peer Count:</strong> The number of connected nodes in the Bitcoin network.</li>
          <li><strong>Unconfirmed Transactions:</strong> The number of transactions waiting to be included in a block.</li>
        </ul>
      </Section>

      <ButtonContainer>
        <Button onClick={() => setActiveView('database')}>View Database</Button>
        <Button onClick={() => setActiveView('visualizations')}>View Visualizations</Button>
      </ButtonContainer>
    </>
  );

  return (
    <AppContainer>
      <ContentWrapper>
        {activeView === 'home' && renderHome()}

        {activeView === 'database' && (
          <>
            <StyledTitle>Bitcoin Database</StyledTitle>
            <Table>
              <thead>
                <TableRow>
                  <TableHeader>Height</TableHeader>
                  <TableHeader>Hash</TableHeader>
                  <TableHeader>Time</TableHeader>
                  <TableHeader>Price (USD)</TableHeader>
                </TableRow>
              </thead>
              <tbody>
                {bitcoinDetails.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell>{detail.height}</TableCell>
                    <TableCell>{detail.hash}</TableCell>
                    <TableCell>{new Date(detail.time).toLocaleString()}</TableCell>
                    <TableCell>${detail.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
            <Button onClick={() => setActiveView('home')}>Back to Home</Button>
          </>
        )}

        {activeView === 'visualizations' && (
          <>
            <StyledTitle>Bitcoin Insights</StyledTitle>
            
            <CardContainer>
              <Card>
                <CardTitle>Latest Block Height</CardTitle>
                <CardValue>{latestData.height}</CardValue>
              </Card>
              <Card>
                <CardTitle>Latest Price</CardTitle>
                <CardValue>${latestData.price.toFixed(2)}</CardValue>
              </Card>
              <Card>
                <CardTitle>Peer Count</CardTitle>
                <CardValue>{latestData.peer_count}</CardValue>
              </Card>
              <Card>
                <CardTitle>Unconfirmed Transactions</CardTitle>
                <CardValue>{latestData.unconfirmed_count}</CardValue>
              </Card>
              <Card>
                <CardTitle>Last Fork Height</CardTitle>
                <CardValue>{latestData.last_fork_height}</CardValue>
              </Card>
              <Card>
                <CardTitle>High Fee per KB</CardTitle>
                <CardValue>{latestData.high_fee_per_kb}</CardValue>
              </Card>
            </CardContainer>

            <ChartContainer>
              <Line data={priceData} options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: true, text: 'Bitcoin Price History'}}}} />
            </ChartContainer>
            <Description>
              Price chart shows Bitcoin's market value over time, reflecting market dynamics and investor sentiment.
            </Description>

            <ChartContainer>
              <Bar data={blockHeightData} options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: true, text: 'Block Height Progression'}}}} />
            </ChartContainer>
            <Description>
              Block height represents the blockchain's length, indicating network growth and security.
            </Description>

            <ChartContainer>
              <Line data={feeData} options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: true, text: 'Transaction Fees'}}}} />
            </ChartContainer>
            <Description>
              Fee trends reflect network congestion and transaction prioritization.
            </Description>

            <Button onClick={() => setActiveView('home')}>Back to Home</Button>
          </>
        )}
      </ContentWrapper>
    </AppContainer>
  );
}

export default App;