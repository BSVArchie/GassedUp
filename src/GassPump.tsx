import { useEffect, useState } from 'react';
import { TextField, Box, Button, Container, Typography } from '@mui/material';
import { green } from '@mui/material/colors'

function GassPump() {

    const [gallons, setGallons] = useState<number>(0)
    const [octainPrice, setOctainPrice] = useState<number>(0)
    const [totalPrice, setTotalPrice] = useState()
    const [isPumping, setIsPumping] = useState(false)



    function setPrice(price: number) {
        setOctainPrice(price)
        console.log(octainPrice)
    }

    useEffect(() => {
        let interval: NodeJS.Timeout | null=null

        if (isPumping) {
            interval = setInterval(() => {
                setGallons((gallons: number) => gallons + 10);
            }, 1000); // 1000 ms = 1 second
        } else if (!isPumping && interval) {
            clearInterval(interval)
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };

    }, [isPumping])


    function startPump() {
        setIsPumping(true)
    }

    function stopPump() {
        setIsPumping(false)
        console.log('stop pump', isPumping)
    }

    return (
        <>
            <Container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', flexWrap: 'wrap', width: '66%' }}>
                <Box sx={{ border: '2px solid black', display: 'flex',  p: 1, m: 1,  }}>
                    <Typography>
                        {`Total Gallons: ${gallons}`}
                    </Typography>
                </Box>
                <Box sx={{ border: '2px solid black', display: 'flex',  p: 1, m: 1,  }}>
                    <Typography>
                        {`Total Price Satoshis: ${totalPrice}`}
                    </Typography>
                </Box>
            </Container>
            <Container sx={{ justifyContent: 'center', display: 'flex', p: .03 }}>


                <Box sx={{ backgroundColor: 'gold', border: '4px solid black', display: 'flex', flexDirection: 'column', p: 3, m: 3, width: 200, height: 260 }}>
                    <Box sx={{ border: '2px solid black'}}>
                        <Typography variant='h5'sx={{ p: 2}}>
                            Price: 100 Sats
                        </Typography>
                    </Box>
                    <Typography variant='h3'sx={{ p: 2}}>
                        Regular
                    </Typography>
                    <Typography variant='h3'>
                        87
                    </Typography>
                    <Button variant="contained" sx={{ m: 2, bgcolor: 'black', "&:hover": { bgcolor: 'black' } }} onClick={() => setPrice(100)}>Select</Button>
                </Box>


                <Box sx={{ backgroundColor: 'gold', border: '4px solid black', display: 'flex', flexDirection: 'column', p: 3, m: 3, width: 200, height: 260 }}>
                    <Box sx={{ border: '2px solid black'}}>
                        <Typography variant='h5'sx={{ p: 2}}>
                            Price: 200 Sats
                        </Typography>
                    </Box>
                    <Typography variant='h3'sx={{ p: 2}}>
                        Plus
                    </Typography>
                    <Typography variant='h3'>
                        89
                    </Typography>
                    <Button variant="contained" sx={{ m: 2, bgcolor: 'black', "&:hover": { bgcolor: 'black' } }} onClick={() => setPrice(200)}>Select</Button>
                </Box>


                <Box sx={{ backgroundColor: 'gold', border: '4px solid black', display: 'flex', flexDirection: 'column', p: 3, m: 3, width: 200, height: 260 }}>
                    <Box sx={{ border: '2px solid black'}}>
                        <Typography variant='h5'sx={{ p: 2}}>
                            Price: 300 Sats
                        </Typography>
                    </Box>
                    <Typography variant='h3'sx={{ p: 2}}>
                        Premium
                    </Typography>
                    <Typography variant='h3'>
                        93
                    </Typography>
                    <Button variant="contained" sx={{ m: 2, bgcolor: 'black', "&:hover": { bgcolor: 'black' } }} onClick={() => setPrice(300)}>Select</Button>
                </Box>
            </Container>
            <Container>
                <Button variant="contained" sx={{ m: 2, width: '30%', bgcolor: 'green', "&:hover": { bgcolor: 'green' } }} onClick={() => startPump()}>Start</Button>
                <Button variant="contained" sx={{ m: 2, width: '30%', bgcolor: 'red', "&:hover": { bgcolor: 'red' } }} onClick={() => stopPump()}>Stop</Button>
                <Button variant="contained" sx={{ m: 2, width: '30%', bgcolor: 'grey', "&:hover": { bgcolor: 'grey' } }} >Complete</Button>
            </Container>


        </>
    )
}

export default GassPump
