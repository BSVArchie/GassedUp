import { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent,DialogActions, TextField } from '@mui/material';

function SetDeploy() {

    const [open, setOpen] = useState(false)

    const openModel = () => {
        setOpen(true)
        console.log(open)
    }

    const deployContract = () => {

        setOpen(false)
    }

    const cancel = () => {

        setOpen(false)
    }

    return (
        <>
            <Button onClick = {openModel} variant="contained" sx={{ m: 1, bgcolor: 'gold', "&:hover": { bgcolor: 'gold' } }} >Bitcoin</Button>

            <Dialog open={open} fullWidth>
                <DialogTitle>Enter Amount</DialogTitle>
                <DialogContent>
                    <TextField label="Satoshis"></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick = {deployContract} color='success' variant='contained'>Deploy</Button>
                    <Button onClick = {cancel} color='error' variant='contained'>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>


    )
}

export default SetDeploy
