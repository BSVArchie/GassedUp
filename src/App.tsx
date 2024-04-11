import React from 'react';
import logo from './logo.svg';
import './App.css';
import GassPump from './GassPump';
import { Typography, Container, Box } from '@mui/material';

function App() {

  // const handlePump = {

  // }

  return (
    <div className="App">
      <Container sx={{ border: '6px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'center'  }}>
        <Typography variant='h2' sx={{ m: 1 }}>
          Gassed Up
        </Typography>
        <Box width={400} sx={{
            border: '2px solid black',
            color: '#666666',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '0.25rem',
            textAlign: 'left',
          }}>
          <Typography>
            <ol>
              <li>
                Connect Wallet
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
        </Box>
        <GassPump/>
      </Container>
    </div>
  );
}

export default App;
