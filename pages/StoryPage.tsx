import AutorenewIcon from "@mui/icons-material/Autorenew";
import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  LinearProgress,
} from "@mui/material";
import Image from "next/image";
import { useMemo, useState } from "react";
import { DIVIDER } from "../constants";
import ErrorMessage from "./ErrorMessage";
import { useGeneratedImage, useGeneratedText } from "../hooks";

const IMAGE_SIZE = 512;
const PADDING = 48;

interface PageProps {
  prefix: string;
  onAddPage: (pageText: string) => void;
  onDeleteFuturePages: () => void;
}

export default function StoryPage({
  prefix,
  onAddPage,
  onDeleteFuturePages,
}: PageProps) {
  const [pageText, pageTextErrorMessage, regeneratePageText] =
    useGeneratedText(prefix);
  const [selectedOption, setSelectedOption] = useState<number | undefined>();

  const structure = useMemo(() => {
    if (!pageText) return undefined;
    const dividerIndex = pageText.indexOf(DIVIDER);
    if (dividerIndex < 0) return { description: pageText };
    const description = pageText.substring(0, dividerIndex);
    const options = pageText
      .substring(dividerIndex + DIVIDER.length)
      .trim()
      .split(/#[0-9]:\s*/)
      .map((segment) => segment.trim())
      .filter(Boolean);
    return { description, options };
  }, [pageText]);

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      raised
    >
      <IconButton
        style={{ marginBottom: PADDING / 2 }}
        disabled={!pageText && !pageTextErrorMessage}
        onClick={() => {
          regeneratePageText();
          setSelectedOption(undefined);
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
          <div style={{ fontStyle: "italic" }}>
            {structure.description
              .split("\n")
              .map((paragraph, i) => paragraph && <p key={i}>{paragraph}</p>)}
          </div>
          {structure.options && (
            <>
              <h4>{DIVIDER}</h4>
              {structure.options.map((option, i) => (
                <Button
                  key={i}
                  fullWidth
                  variant={selectedOption === i ? "contained" : "text"}
                  onClick={() => {
                    setSelectedOption(i);
                    onAddPage(pageText + "\n" + i + "\n");
                  }}
                >
                  {option}
                </Button>
              ))}
            </>
          )}
        </>
      ) : pageTextErrorMessage ? (
        <ErrorMessage message={pageTextErrorMessage} />
      ) : (
        <LinearProgress style={{ width: IMAGE_SIZE }} />
      )}
    </Card>
  );
}
