import {
  faLinkedin,
  faThreads,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from '@mui/material'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid2'
import { useCallback, useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useForm } from 'react-hook-form'

//
export const chunking = (text: string, chunkSize: number): string[] => {
  const words = text.split(/(\s+)/) // \s+ will capture spaces and line breaks like '\n'

  const chunks = []
  let currentChunk = ''
  let currentLength = 0
  words.forEach((word) => {
    // Determine the effective length of the word including the space/newline
    const wordLength = word.length

    // Check if adding the word would exceed the chunk size
    if (currentLength + wordLength > chunkSize) {
      // If currentChunk is not empty, push it to chunks
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim())
      }
      // Reset current chunk and length
      currentChunk = word
      currentLength = wordLength
    } else {
      // If it fits, add the word to the current chunk
      currentChunk += word
      currentLength += wordLength
    }
  })

  // Push the final chunk if it's not empty
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim())
  }
  console.log({ chunkCount: chunks.length })
  return chunks
}

const Threads = (params: { longFormText: string; chunkSize?: number }) => {
  const { longFormText, chunkSize = 500 } = params
  const [chunks, setChunks] = useState<string[]>([])
  const [last, setLast] = useState<string>('')
  interface Toggle {
    [key: string]: boolean
  }
  const [toggleState, setToggle] = useState<Toggle>({})

  const toggle = useCallback((index: number) => {
    setToggle((prevState) => ({
      ...prevState,
      [`a${index}`]: !prevState[`a${index}`],
    }))
  }, [])

  useEffect(() => {
    console.log('--', { chunkSize })
    setLast(longFormText)
    setToggle({})
    // const paragraphs = longFormText.split(/\n+/)

    setChunks(chunking(longFormText, chunkSize))
    chunks.forEach((_, index) => {
      toggle(index)
    })
  }, [longFormText, chunkSize])

  return chunks.map((chunk, index) => (
    <Box key={`msg${index}`} sx={{ padding: 2 }}>
      <Card>
        <CardHeader title={index + 1} />
        <CardContent className="post_container">
          <CopyToClipboard text={chunks[index]}>
            <Typography
              sx={{ color: toggleState[`a${index}`] ? '#000000' : '#B2B2B2' }}
              onMouseDown={() => toggle(index)}
              onMouseUp={() => toggle(index)}
            >
              {chunk}
            </Typography>
          </CopyToClipboard>
        </CardContent>
        <CardActions>
          <Typography align="right" sx={{ width: '100%' }}>
            {chunk.length}
          </Typography>
        </CardActions>
      </Card>
    </Box>
  ))
}

function App() {
  const [longFormText, setLongFormText] = useState<string>('')
  const [target, setTarget] = useState<string>('threads')
  const {
    register,

    formState: { errors },
  } = useForm<Inputs>()

  type Inputs = {
    longform: string
    thread: string
  }

  const postCountLimits: { [key: string]: number } = {
    threads: 500,
    linkedin: 1000,
    twitter: 280,
  }
  console.log({ target: target, chunkSize: postCountLimits[target] })
  return (
    <>
      <Container
        maxWidth="lg"
        disableGutters={true}
        sx={{
          display: 'flex',
          minHeight: '100vh',
        }}
      >
        <Box>
          <Grid minHeight="100%" container spacing={2}>
            <Grid size={6} className="leftCol">
              <Grid>
                <Box sx={{ padding: 1 }}>
                  <Typography variant="h4">Longform</Typography>
                </Box>
              </Grid>
              <Grid>
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
                    defaultValue={''}
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
            <Grid size={6} className="rightCol">
              <Grid>
                <Box sx={{ padding: 1 }}>
                  <Typography variant="h4">Thread ( {target} )</Typography>
                </Box>
              </Grid>
              <Grid>
                <Box sx={{ padding: 1 }}>
                  <ButtonGroup>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        padding: '6px',
                        minWidth: '40px',
                        minHeight: '40px',
                      }}
                      onClick={() => setTarget('threads')}
                    >
                      <FontAwesomeIcon icon={faThreads} />
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        padding: '6px',
                        minWidth: '40px',
                        minHeight: '40px',
                      }}
                      onClick={() => setTarget('twitter')}
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        padding: '6px',
                        minWidth: '40px',
                        minHeight: '40px',
                      }}
                      onClick={() => setTarget('linkedin')}
                    >
                      <FontAwesomeIcon icon={faLinkedin} />
                    </Button>
                  </ButtonGroup>
                </Box>
              </Grid>
              <Grid>
                <Box sx={{ overflowY: 'scroll' }}>
                  <Threads
                    longFormText={longFormText}
                    chunkSize={postCountLimits[target]}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default App
