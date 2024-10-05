import {
  faLinkedin,
  faThreads,
  faTwitter,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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

const continuationMarkers: { [key: number]: string } = {
  10: 'None',
  20: ' ...',
  30: ' >',
  40: ' 1/n',
}

export const chunking = (
  text: string,
  chunkSize: number,
  continuationMarker: string
): string[] => {
  const words = text.split(/(\s+|\n+)/)

  const chunks = []
  let currentChunk = ''
  let currentLength = 0

  const getCMarkerLength = (): number => {
    if (continuationMarker === 'None') {
      return 0
    }
    if (continuationMarker === ' 1/n') {
      return 5
    }
    return continuationMarker.length
  }

  const getCMarker = (index: number, total: number) => {
    if (continuationMarker === 'None') {
      return ''
    }
    if (continuationMarker === ' 1/n') {
      return ` ${(index + 1).toString().padStart(2, '0')}/${total.toString().padStart(2, '0')}`
    }
    return continuationMarker
  }

  words.forEach((word) => {
    let br = false
    if (word === '\n' || word === '\n\n') {
      br = true
    }

    const wordLength = word.length
    if (currentLength + wordLength > chunkSize - getCMarkerLength()) {
      if (currentChunk.length > 0) {
        chunks.push(br ? currentChunk : currentChunk.trim())
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

  return chunks.map((chunk, index) => {
    if (index !== chunks.length - 1) {
      return chunk + getCMarker(index, chunks.length)
    } else {
      return chunk
    }
  })
}

interface PostsProps {
  longFormText: string
  chunkSize?: number
}

const Posts = (params: PostsProps) => {
  const { longFormText } = params
  interface UseFormInputs {
    continuationMarker: number
  }
  const { register, watch } = useForm<UseFormInputs>({
    defaultValues: {
      continuationMarker: 10,
    },
  })
  const [target, setTarget] = useState<string>('threads')
  interface Toggle {
    [key: string]: boolean
  }
  const [continuationMarkerId, setContinuationMarkerId] = useState<number>(10)
  const [toggleState, setToggle] = useState<Toggle>({})
  const [chunks, setChunks] = useState<string[]>([])
  const formValues = watch()
  console.log({
    formValue: formValues.continuationMarker,
    continuationMarkerId,
  })
  const continuationMarker = continuationMarkers[formValues.continuationMarker]

  useEffect(() => {
    setChunks(chunking(longFormText, chunkSizes[target], continuationMarker))
    chunks.forEach((_, index) => {
      setToggle((prevState) => ({
        ...prevState,
        [`a${index}`]: false,
      }))
    })
  }, [longFormText, target, setToggle, continuationMarker])

  const toggle = (index: number) => {
    setToggle((prevState) => ({
      ...prevState,
      [`a${index}`]: !prevState[`a${index}`],
    }))
  }

  return (
    <Grid size={6} className="rightCol" sx={{ height: '100%' }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Box sx={{ padding: 1 }}>
            <Typography variant="h4">
              <FontAwesomeIcon icon={targetIcons[target]} /> Thread
            </Typography>
          </Box>
        </Grid>
        <Grid size={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
            <ButtonGroup sx={{ flexShrink: 0 }}>
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
            <FormControl sx={{ flexGrow: 1, marginLeft: 2 }}>
              <InputLabel id="continuation-marker">
                Continuation Marker
              </InputLabel>
              <Select
                {...register('continuationMarker', {
                  onChange: (e) => {
                    console.log(e.target.value)
                    setContinuationMarkerId(e.target.value as number)
                  },
                })}
                size="small"
                labelId="continuation-marker"
                id="continuation-marker"
                value={continuationMarkerId}
                label="Continuation Marker"
              >
                <MenuItem value={10}>None</MenuItem>
                <MenuItem value={20}>...</MenuItem>
                <MenuItem value={30}>&gt;</MenuItem>
                <MenuItem value={40}>1/n</MenuItem>
              </Select>
            </FormControl>
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
