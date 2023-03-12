import { Button, ButtonGroup, IconButton } from "@mui/material";
import { useState } from "react";
import StoryPage from "./StoryPage";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Story() {
  const [prefixes, setPrefixes] = useState([
    `
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
    `,
  ]);
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <>
      {prefixes.map((prefix, i) => (
        <div key={prefix} hidden={pageNumber !== i}>
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
              disabled={pageNumber >= prefixes.length - 1}
              onClick={() => setPageNumber((pageNumber) => pageNumber + 1)}
            >
              Next
            </Button>
          </ButtonGroup>
          <StoryPage
            prefix={prefix}
            onAddPage={(newPage) => {
              setPrefixes([
                ...prefixes.slice(0, i + 1),
                prefix + "\n" + newPage,
              ]);
              setPageNumber(i + 1);
            }}
            onDeleteFuturePages={() => {
              setPrefixes(prefixes.slice(0, i + 1));
            }}
          />
        </div>
      ))}
    </>
  );
}
