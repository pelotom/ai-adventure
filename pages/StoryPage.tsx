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
const PADDING = 32;

interface StoryPageProps {
  prefix: ChatCompletionRequestMessage[];
  onAddPage: (content: string, choice: number) => void;
  onDeleteFuturePages: () => void;
}

interface StoryStructure {
  description: string;
  choices?: string[];
}

export default function StoryPage({
  prefix,
  onAddPage,
  onDeleteFuturePages,
}: StoryPageProps) {
  const [content, contentErrorMessage, regenerateContent] =
    useGeneratedText(prefix);
  const [selectedChoice, setSelectedChoice] = useState<number | undefined>();

  const structure = useMemo<StoryStructure>(() => {
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
    return { description, choices: options };
  }, [content]);

  return (
    <Card
      style={{
        width: (IMAGE_SIZE + PADDING) * 2,
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
        <div style={{ display: 'flex' }}>
          <div style={{ width: IMAGE_SIZE, marginRight: PADDING }}>
            <StoryContent structure={structure} />
            {structure.choices && (
              <StoryChoices
                choices={structure.choices}
                selectedChoice={selectedChoice}
                onChoose={(choice) => {
                  setSelectedChoice(choice);
                  onAddPage(content, choice);
                }}
              />
            )}
          </div>
          <StoryImage structure={structure} />
        </div>
      ) : contentErrorMessage ? (
        <ErrorMessage message={contentErrorMessage} />
      ) : (
        <LinearProgress style={{ width: IMAGE_SIZE * 2 }} />
      )}
    </Card>
  );
}

interface StoryContentProps {
  structure: StoryStructure;
}

function StoryContent({ structure }: StoryContentProps) {
  return (
    <div style={{ fontStyle: 'italic' }}>
      {structure.description
        .split('\n')
        .map((paragraph, i) => paragraph && <p key={i}>{paragraph}</p>)}
    </div>
  );
}

interface StoryChoicesProps {
  choices: string[];
  selectedChoice: number | undefined;
  onChoose: (choice: number) => void;
}

function StoryChoices({
  choices,
  selectedChoice,
  onChoose,
}: StoryChoicesProps) {
  return (
    <div>
      <h4>{DIVIDER}</h4>
      {choices.map((option, choice) => (
        <Button
          key={choice}
          fullWidth
          variant={selectedChoice === choice ? 'contained' : 'text'}
          onClick={() => onChoose(choice)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}

interface StoryImageProps {
  structure: StoryStructure;
}

function StoryImage({ structure }: StoryImageProps) {
  const [imageUrl, imageErrorMessage] = useGeneratedImage(
    structure &&
      `
      Beautiful illustration for this passage in a story: ${structure.description}
      Do NOT include words or lettering of any kind!
      `
  );

  return (
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
  );
}
