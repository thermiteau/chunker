import { Box } from '@mui/material'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid2'
import { useState } from 'react'
import LongForm from './components/longform'
import Posts from './components/thread'

function App() {
  const [longFormText, setLongFormText] = useState<string>('')

  return (
    <>
      <Container
        maxWidth="lg"
        disableGutters={true}
        sx={{
          display: 'flex',
          height: '100vh',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            <LongForm
              longFormText={longFormText}
              setLongFormText={setLongFormText}
            />
            <Posts longFormText={longFormText} />
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default App
