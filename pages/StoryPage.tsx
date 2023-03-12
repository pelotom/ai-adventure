import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  LinearProgress,
} from '@mui/material';
import Image from 'next/image';
import { ChatCompletionRequestMessage } from 'openai';
import { useMemo, useState } from 'react';
import { DIVIDER } from '../constants';
import { useGeneratedImage, useGeneratedText } from '../hooks';
import ErrorMessage from './ErrorMessage';

const IMAGE_SIZE = 512;
const PADDING = 48;

interface PageProps {
  prefix: ChatCompletionRequestMessage[];
  onAddPage: (content: string, choice: number) => void;
  onDeleteFuturePages: () => void;
}

export default function StoryPage({
  prefix,
  onAddPage,
  onDeleteFuturePages,
}: PageProps) {
  const [content, contentErrorMessage, regenerateContent] =
    useGeneratedText(prefix);
  const [selectedChoice, setSelectedChoice] = useState<number | undefined>();

  const structure = useMemo(() => {
    if (!content) return undefined;
    const dividerIndex = content.indexOf(DIVIDER);
    if (dividerIndex < 0) return { description: content };
    const description = content.substring(0, dividerIndex);
    const options = content
      .substring(dividerIndex + DIVIDER.length)
      .trim()
      .split(/#[0-9]:\s*/)
      .map((segment) => segment.trim())
      .filter(Boolean);
    return { description, options };
  }, [content]);

  const [imageUrl, imageErrorMessage] = useGeneratedImage(
    structure &&
      `
      Beautiful illustration for this passage in a story: ${structure.description}
      Do NOT include words or lettering of any kind!
      `
  );

  return (
    <Card
      style={{
        width: IMAGE_SIZE + PADDING,
        padding: PADDING,
        paddingTop: PADDING / 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      raised
    >
      <IconButton
        style={{ marginBottom: PADDING / 2 }}
        disabled={!content && !contentErrorMessage}
        onClick={() => {
          regenerateContent();
          setSelectedChoice(undefined);
          onDeleteFuturePages();
        }}
      >
        <AutorenewIcon />
      </IconButton>
      {structure ? (
        <>
          <div
            style={{
              width: IMAGE_SIZE,
              height: IMAGE_SIZE,
              marginBottom: PADDING,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="generated image"
                width={IMAGE_SIZE}
                height={IMAGE_SIZE}
              />
            ) : imageErrorMessage ? (
              <ErrorMessage message={imageErrorMessage} />
            ) : (
              <CircularProgress style={{ width: 100, height: 100 }} />
            )}
          </div>
          <div style={{ fontStyle: 'italic' }}>
            {structure.description
              .split('\n')
              .map((paragraph, i) => paragraph && <p key={i}>{paragraph}</p>)}
          </div>
          {structure.options && (
            <>
              <h4>{DIVIDER}</h4>
              {structure.options.map((option, choice) => (
                <Button
                  key={choice}
                  fullWidth
                  variant={selectedChoice === choice ? 'contained' : 'text'}
                  onClick={() => {
                    setSelectedChoice(choice);
                    onAddPage(content, choice);
                  }}
                >
                  {option}
                </Button>
              ))}
            </>
          )}
        </>
      ) : contentErrorMessage ? (
        <ErrorMessage message={contentErrorMessage} />
      ) : (
        <LinearProgress style={{ width: IMAGE_SIZE }} />
      )}
    </Card>
  );
}
