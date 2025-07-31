import React from "react";
import { Paper, Button, Box, Typography, Divider, List, ListItem, ListItemText } from "@mui/material";

export default function CROProfileReview({ profile, onEdit, onContinue }) {
  // Helper function to format business units
  const formatBusinessUnits = (businessUnits) => {
    if (!businessUnits) return "-";
    if (Array.isArray(businessUnits)) {
      return businessUnits.map(unit => unit.name || unit).join(", ");
    }
    return businessUnits;
  };

  // Helper function to format areas of concern
  const formatAreasOfConcern = (areasOfConcern) => {
    if (!areasOfConcern) return "-";
    if (Array.isArray(areasOfConcern)) {
      return areasOfConcern.map(concern => concern.category || concern).join(", ");
    }
    return areasOfConcern.join(", ");
  };

  // Helper function to format regions
  const formatRegions = (regions) => {
    if (!regions) return "-";
    if (Array.isArray(regions)) {
      return regions.join(", ");
    }
    return regions;
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 620, mx: "auto", my: 6, p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Review Your Profile</Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        <ListItem>
          <ListItemText primary="Company Name" secondary={profile.companyName || profile.name} />
        </ListItem>
        <ListItem>
          <ListItemText primary="HQ Location" secondary={profile.hqLocation || profile.additionalInfo?.hqLocation} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Business Units" secondary={formatBusinessUnits(profile.businessUnits)} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Supply Chain Nodes" secondary={profile.supplyChainNodes || profile.additionalInfo?.supplyChainNodes} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Critical Regions" secondary={formatRegions(profile.criticalRegions || profile.regions)} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Event Types Concerned" secondary={formatAreasOfConcern(profile.eventTypesConcerned || profile.areasOfConcern)} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Past Disruptions" secondary={profile.pastDisruptions || profile.additionalInfo?.pastDisruptions} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Stakeholders to Alert" secondary={profile.stakeholders || profile.additionalInfo?.stakeholders} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Preferred Report Delivery" secondary={profile.deliveryPreference || profile.additionalInfo?.deliveryPreference} />
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
