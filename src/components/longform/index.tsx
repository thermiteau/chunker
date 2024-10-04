import { Box, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useForm } from 'react-hook-form'

interface LongFormProps {
  longFormText: string
  setLongFormText: (text: string) => void
}
const LongForm = (params: LongFormProps) => {
  const { register } = useForm()
  type Inputs = {
    longform: string
    thread: string
  }
  const { longFormText = '', setLongFormText } = params
  return (
    <Grid size={6} className="longform" sx={{ height: '100%' }}>
      <Grid>
        <Box sx={{ padding: 1 }}>
          <Typography variant="h4">Longform</Typography>
        </Box>
      </Grid>
      <Grid sx={{ overflowY: 'auto', height: '80%' }}>
        <Box
          component="form"
          sx={{
            padding: 1,
            flexDirection: 'column',
            display: 'flex',
            height: '100%',
          }}
        >
          <TextField
            id="outlined-multiline-static"
            label="Longform Text"
            defaultValue={longFormText}
            multiline
            variant="outlined"
            fullWidth
            {...register('longform')}
            onChange={(e) => {
              setLongFormText(e.target.value)
            }}
          />
        </Box>
      </Grid>
    </Grid>
  )
}

export default LongForm
