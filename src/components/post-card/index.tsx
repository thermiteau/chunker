import { Card, CardActions, CardContent, Typography } from '@mui/material'

import { CopyToClipboard } from 'react-copy-to-clipboard'

interface PostCardProps {
  chunk: string
  index: number
  toggle: (index: number) => void
  toggleState: { [key: string]: boolean }
}

const PostCard = (params: PostCardProps) => {
  const { chunk, index, toggle, toggleState } = params
  return (
    <Card sx={{ margin: 2 }}>
      <CardContent className="post_container">
        <CopyToClipboard text={chunk}>
          <Typography
            sx={{ color: toggleState[`a${index}`] ? '#B2B2B2' : '#000000' }}
            onMouseDown={() => toggle(index)}
            // onMouseUp={() => toggle(index)}
          >
            {chunk}
          </Typography>
        </CopyToClipboard>
      </CardContent>
      <CardActions>
        <Typography align="left" sx={{ width: '100%' }}>
          post: {index + 1}
        </Typography>
        {toggleState[`a${index}`] && (
          <Typography align="left" sx={{ width: '100%' }}>
            COPIED
          </Typography>
        )}
        <Typography align="right" sx={{ width: '100%' }}>
          {chunk.length} Characters
        </Typography>
      </CardActions>
    </Card>
  )
}

export default PostCard
