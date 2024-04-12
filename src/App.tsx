import React from 'react';
import logo from './logo.svg';
import './App.css';
import GassPump from './GassPump';
import SetDeploy from './SetDeploy'
import { Typography, Container, Box, Button } from '@mui/material';

function App() {

  // const handlePump = {

  // }

  function handleCash() {
    alert('Bitcoin is more convenient, try it out!!')
  }

  function handleCard() {
    alert('Trusted third parties are expensive, try Bitcoin!!')
  }

  return (
    <div className="App">
      <Container sx={{ border: '6px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant='h2' sx={{ m: 1 }}>
          Gassed Up
        </Typography>
        <Box width='80%' sx={{
            border: '3px solid black',
            color: '#666666',
            display: 'flex',
            // flexDirection: 'column',
            // flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '0.25rem',
            textAlign: 'left',
            m: 'auto',
          }}>
          <Typography>
            <ol>
              <li>
                Connect Wallet/Select Bitcoin
              </li>
              <li>
                Submit Amount
              </li>
              <li>
                Select Grade
              </li>
              <li>
                Press START button to begin pumping
              </li>
              <li>
                Press STOP button to finish pumping
              </li>
              <li>
                Press FINISH button to complete transaction
              </li>
            </ol>
          </Typography>
          <Container sx={{ width: '30%', display: 'flex', flexDirection: 'column'}}>
            <Button variant="contained" sx={{ m: 1, bgcolor: 'green', "&:hover": { bgcolor: 'green' } }} onClick={() => handleCash()}>$ Cash</Button>
            <Button variant="contained" sx={{ m: 1 }} onClick={() => handleCard()}>Visa</Button>
            <SetDeploy/>
            {/* <Button variant="contained" sx={{ m: 1, bgcolor: 'gold', "&:hover": { bgcolor: 'gold' } }} onClick={() => SetDeploy()}>Bitcoin</Button> */}
          </Container>
        </Box>
        <GassPump/>
      </Container>
    </div>
  );
}

export default App;
