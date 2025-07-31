import React from "react";
import { Paper, Button, Box, Typography, Divider, List, ListItem, ListItemText } from "@mui/material";

export default function CROProfileReview({ profile, onEdit, onContinue }) {
  return (
    <Paper elevation={3} sx={{ maxWidth: 620, mx: "auto", my: 6, p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Review Your Profile</Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        <ListItem>
          <ListItemText primary="Company Name" secondary={profile.companyName} />
        </ListItem>
        <ListItem>
          <ListItemText primary="HQ Location" secondary={profile.hqLocation} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Business Units" secondary={profile.businessUnits || "-"} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Supply Chain Nodes" secondary={profile.supplyChainNodes || "-"} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Critical Regions" secondary={profile.criticalRegions || "-"} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Event Types Concerned" secondary={profile.eventTypesConcerned.join(", ") || "-"} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Past Disruptions" secondary={profile.pastDisruptions || "-"} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Stakeholders to Alert" secondary={profile.stakeholders || "-"} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Preferred Report Delivery" secondary={profile.deliveryPreference} />
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onEdit}>Edit Profile</Button>
        <Button variant="contained" color="primary" onClick={onContinue}>Continue</Button>
      </Box>
    </Paper>
  );
}
