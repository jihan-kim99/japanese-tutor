"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Box, Button, Input, Typography } from "@mui/material";

export default function Home() {
  const [input, setInput] = useState("");
  const output = useRef("");
  const history = useRef<string[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const ask = async () => {
    history.current = [...history.current, input];
    console.log(history);
    const response = await fetch("/api/askAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: history.current.join("\n") }),
    });
    const data = await response.json();
    output.current = JSON.parse(data.text.message.content).response;
    setInput("");
    history.current = [...history.current, output.current];
  };

  useEffect(() => {
    if (history.current.length > 10) {
      history.current.shift();
    }
  }, [history]);

  return (
    <Box
      sx={{
        width: "100%",
        alignContent: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        m: 1,
      }}
    >
      <Box
        sx={{
          width: "50%",
          height: "60dvh",
          alignSelf: "center",
        }}
      >
        <Typography variant="h3">AskAI</Typography>
        <Typography variant="h6">Ask a question and get an answer</Typography>
        <Typography variant="h6">
          AskAI is powered by OpenAI&apos;s GPT-3.5
        </Typography>
        <Box
          sx={{
            border: "1px solid black",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            height: "40dvh",
            mt: "60px",
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
        >
          <Typography variant="h6">{output.current}</Typography>
        </Box>
        <Box sx={{ mt: "60px", display: "flex", flexDirection: "column" }}>
          <Input
            placeholder="Ask a question"
            value={input}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                ask();
              }
            }}
          />
        </Box>
        <Box sx={{ mt: "20px" }}>
          <Button
            variant="contained"
            style={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "18px",
            }}
            onClick={ask}
          >
            Ask
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
