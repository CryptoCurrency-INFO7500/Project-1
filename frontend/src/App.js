import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

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
  max-width: 800px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.5);
  }
`;

const Title = styled.h1`
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

const NoDataMessage = styled.td`
  text-align: center;
  padding: 30px;
  color: #666;
  font-style: italic;
`;

const DropdownContainer = styled.div`
  margin-bottom: 20px;
`;

const DropdownButton = styled.button`
  background-color: #3498db;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const DropdownContent = styled.div`
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 15px;
  margin-top: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Link = styled.a`
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  display: block;
  margin-bottom: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 15px;
`;

function App() {
  const [bitcoinDetails, setBitcoinDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/bitcoin-details')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched Bitcoin Data:", data);
        setBitcoinDetails(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <AppContainer><ContentWrapper><Title>Loading...</Title></ContentWrapper></AppContainer>;
  if (error) return <AppContainer><ContentWrapper><Title>Error: {error}</Title></ContentWrapper></AppContainer>;

  return (
    <AppContainer>
      <ContentWrapper>
        <Title>Project: Bitcoin Explorer</Title>
        <Subtitle>Part 1</Subtitle>
        <Subtitle>Team: Aakshatha Patil, Sumanayana Konda, Ruthwik BG</Subtitle>
        <Subtitle>Tools Used: React, NodeJs, PostgreSQL and Rust</Subtitle>
        
        <DropdownContainer>
          <DropdownButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {isDropdownOpen ? 'Hide Project Links' : 'Show Project Links'}
          </DropdownButton>
          {isDropdownOpen && (
            <DropdownContent>
              <Link href="https://github.com/CryptoCurrency-INFO7500/Project-1" target="_blank" rel="noopener noreferrer">
                GitHub Repository
              </Link>
              <Description>
                Access the project's source code and contribute to its development.
              </Description>
              <Link href="https://codelabs-preview.appspot.com/?file_id=1nGuJebyQEeMvaYzBLiP_bFUp9g18bfj34dL1UK5e1CY#0" target="_blank" rel="noopener noreferrer">
                CodeLabs Tutorial
              </Link>
              <Description>
                Follow our step-by-step tutorial to understand and recreate this project.
              </Description>
            </DropdownContent>
          )}
        </DropdownContainer>

        <Table>
          <thead>
            <TableRow>
              <TableHeader>Height</TableHeader>
              <TableHeader>Hash</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {bitcoinDetails.length > 0 ? (
              bitcoinDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>{detail.height}</TableCell>
                  <TableCell>{detail.hash}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <NoDataMessage colSpan="2">No Bitcoin details available</NoDataMessage>
              </TableRow>
            )}
          </tbody>
        </Table>
      </ContentWrapper>
    </AppContainer>
  );
}

export default App;