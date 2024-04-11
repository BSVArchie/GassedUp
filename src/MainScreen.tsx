import { useEffect, useState } from 'react';
import { TextField, Box, Button, Container, Typography } from '@mui/material';

function MainScreen() {

    function handleCash() {
        alert('Bitcoin is more convenient, try it out!!')
    }

    function handleCard() {
        alert('Trusted third parties are expensive, try Bitcoin!!')
    }

    function handleBitcoin() {
        alert('Pop up window for user to enter number of Sats to put in escrow')
    }

    return (
        <Container sx={{ width: '30%', display: 'flex', flexDirection: 'column'}}>
            <Button variant="contained" sx={{ m: 1, bgcolor: 'green', "&:hover": { bgcolor: 'green' } }} onClick={() => handleCash()}>$ Cash</Button>
            <Button variant="contained" sx={{ m: 1 }} onClick={() => handleCard()}>Visa</Button>
            <Button variant="contained" sx={{ m: 1, bgcolor: 'gold', "&:hover": { bgcolor: 'gold' } }} onClick={() => handleBitcoin()}>Bitcoin</Button>
        </Container>
    )
}

export default MainScreen
