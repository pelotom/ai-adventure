import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, ButtonGroup } from '@mui/material';
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai';
import { useMemo, useState } from 'react';
import StoryPage from './StoryPage';

interface CompletedPage {
  content: string;
  choice: number;
}

const initialPrompt = `
Make up a choose-your-own-adventure book. The plot is up to you, make it interesting!

Observe the following guidelines:
- Written in the second person, addressed to the reader
- Uses interesting, evocative language and lush descriptions

Every page is no more than 150 words long and ends with a list of 3 options for what happens next, like this:
Do you:
#0: <first option>
#1: <second option>
#2: <third option>

Make sure to wait until the reader has selected an option before you say what they do next.

The first page, which gives some backstory on the protagonist, reads:
`;

export default function Story() {
  const [completedPages, setCompletedPages] = useState<CompletedPage[]>([]);
  const prefixes = useMemo<ChatCompletionRequestMessage[][]>(
    () =>
      completedPages
        .reduce(
          (accum, next) => [...accum, [...accum[accum.length - 1], next]],
          [[]] as CompletedPage[][]
        )
        .map((completedPages) => [
          { role: 'user', content: initialPrompt },
          ...completedPages.flatMap(
            ({ content, choice }): ChatCompletionRequestMessage[] => [
              {
                role: ChatCompletionRequestMessageRoleEnum.Assistant,
                content,
              },
              {
                role: ChatCompletionRequestMessageRoleEnum.User,
                content: choice.toString(),
              },
            ]
          ),
        ]),
    [completedPages]
  );
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <>
      {prefixes.map((prefix, i) => (
        <div key={i} hidden={pageNumber !== i}>
          <ButtonGroup style={{ marginBottom: 32 }} variant="text" fullWidth>
            <Button
              startIcon={<ArrowBackIcon />}
              disabled={!pageNumber}
              onClick={() => setPageNumber((pageNumber) => pageNumber - 1)}
            >
              Previous
            </Button>
            <Button
              endIcon={<ArrowForwardIcon />}
              disabled={pageNumber >= completedPages.length}
              onClick={() => setPageNumber((pageNumber) => pageNumber + 1)}
            >
              Next
            </Button>
          </ButtonGroup>
          <StoryPage
            prefix={prefix}
            onAddPage={(content, choice) => {
              setCompletedPages([
                ...completedPages.slice(0, i),
                { content, choice },
              ]);
              setPageNumber(i + 1);
            }}
            onDeleteFuturePages={() => {
              setCompletedPages(completedPages.slice(0, i + 1));
            }}
          />
        </div>
      ))}
    </>
  );
}
