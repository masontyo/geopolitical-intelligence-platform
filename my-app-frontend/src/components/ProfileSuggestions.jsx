import React, { useState } from "react";
import { Paper, Checkbox, FormControlLabel, Button, Typography, Box, Divider, List, ListItem } from "@mui/material";

const SAMPLE_SUGGESTIONS = [
  {
    id: 1,
    text: "Monitor South China Sea geopolitical risk (common for Vietnam/China supply chain)."
  },
  {
    id: 2,
    text: "Include FX/currency volatility alerts (peers in global manufacturing monitor this)."
  },
  {
    id: 3,
    text: "Track EU environmental regulations (frequent concern for transatlantic operations)."
  }
];

export default function ProfileSuggestions({ onComplete }) {
  const [selected, setSelected] = useState(SAMPLE_SUGGESTIONS.map(s => s.id));

  function toggle(id) {
    setSelected(arr =>
      arr.includes(id) ? arr.filter(i => i !== id) : [...arr, id]
    );
  }

  function handleContinue() {
    const accepted = SAMPLE_SUGGESTIONS.filter(s => selected.includes(s.id));
    onComplete(accepted);
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: 620, mx: "auto", my: 6, p: 4 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>Recommended Profile Enrichments</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Based on your sector/peer data, you may benefit from tracking the following:
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box>
        {SAMPLE_SUGGESTIONS.map(s => (
          <List key={s.id}>
            <ListItem disablePadding>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selected.includes(s.id)}
                    onChange={() => toggle(s.id)}
                  />
                }
                label={s.text}
              />
            </ListItem>
          </List>
        ))}
      </Box>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={handleContinue}>
          Continue
        </Button>
      </Box>
    </Paper>
  );
}
