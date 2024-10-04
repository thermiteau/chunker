import {
  faLinkedin,
  faThreads,
  faTwitter,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, ButtonGroup, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import PostCard from '../post-card'

const targetIcons: { [key: string]: IconDefinition } = {
  threads: faThreads,
  twitter: faTwitter,
  linkedin: faLinkedin,
}

const chunkSizes: { [key: string]: number } = {
  threads: 500,
  linkedin: 5000,
  twitter: 280,
}

export const chunking = (text: string, chunkSize: number): string[] => {
  const words = text.split(/(\s+)/)
  const chunks = []
  let currentChunk = ''
  let currentLength = 0
  words.forEach((word) => {
    const wordLength = word.length
    if (currentLength + wordLength > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim())
      }
      currentChunk = word
      currentLength = wordLength
    } else {
      currentChunk += word
      currentLength += wordLength
    }
  })
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim())
  }
  return chunks
}

interface PostsProps {
  longFormText: string
  chunkSize?: number
}

const Posts = (params: PostsProps) => {
  const { longFormText } = params
  const [target, setTarget] = useState<string>('threads')
  interface Toggle {
    [key: string]: boolean
  }
  const [toggleState, setToggle] = useState<Toggle>({})
  const [chunks, setChunks] = useState<string[]>([])
  useEffect(() => {
    setChunks(chunking(longFormText, chunkSizes[target]))
    chunks.forEach((_, index) => {
      setToggle((prevState) => ({
        ...prevState,
        [`a${index}`]: !prevState[`a${index}`],
      }))
    })
  }, [longFormText])

  const toggle = (index: number) => {
    setToggle((prevState) => ({
      ...prevState,
      [`a${index}`]: !prevState[`a${index}`],
    }))
  }
  return (
    <Grid size={6} className="rightCol" sx={{ height: '100%' }}>
      <Grid container spacing={2}>
        <Grid size="grow">
          <Box sx={{ padding: 1 }}>
            <Typography variant="h4">
              <FontAwesomeIcon icon={targetIcons[target]} /> Thread
            </Typography>
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
      </Grid>

      <Grid sx={{ overflowY: 'auto', height: '80%' }}>
        <Box>
          {chunks.map((chunk, index) => (
            <PostCard
              toggleState={toggleState}
              toggle={toggle}
              chunk={chunk}
              index={index}
              key={`post${index}`}
            />
          ))}
        </Box>
      </Grid>
    </Grid>
  )
}

export default Posts
