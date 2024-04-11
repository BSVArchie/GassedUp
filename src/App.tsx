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
        <Box width={200} sx={{ border: '4px solid black', display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', width: 900, height: 300 }}>
          <Typography variant='h6'>
            <div>
              1. Connect Wallet
            </div>
            <div>
              2. Submit Amount
            </div>
            <div>
              3. Select Grade
            </div>
            <div>
              4. Press START button to begin pumping
            </div>
            <div>
              5. Press STOP button to finish pumping
            </div>
            <div>
              6. Press FINISH button to complerte transaction
            </div>
          </Typography>
        </Box>
        <GassPump/>
      </Container>
    </div>
  );
}

export default App;
