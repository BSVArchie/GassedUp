import { useEffect, useState } from 'react';
import { TextField, Box, Button, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TokenImage from './TokenImage.jpg'

// const Token: React.FC<> = () => {

const Token: any = () => {

    const [open, setOpen] = useState(false)
    const [tokenAmount, setTokenAmount] = useState<number>(0)

    function openModel() {
        setOpen(true)
      }

      const cancel = () => {
        setOpen(false)
    }

    return (
        <>
            <Container>
                <Button onClick = {openModel} sx={{ display: 'flex', flexDirection: 'column' }}>
                    Purchas Token
                    {/* Display your image as the button content */}
                    <img src={TokenImage} alt="My Image" style={{ width: '80px', height: '68px' }} />
                </Button>
            </Container>
            <Dialog open={open} fullWidth>
                <DialogTitle>Enter Token Amount</DialogTitle>
                <DialogContent>
                    <TextField onChange = { e => setTokenAmount(Number(e.target.value))} label="Satoshis"></TextField>
                </DialogContent>

                <DialogActions>
                    <Button  color='success' variant='contained'>Prurchase Token</Button>
                    <Button onClick = {cancel} color='error' variant='contained'>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Token
