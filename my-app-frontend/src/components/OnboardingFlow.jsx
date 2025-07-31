import React, { useState } from "react";
import CROOnboardingForm from "./CROOnboardingForm";
import CROProfileReview from "./CROProfileReview";
import ProfileSuggestions from "./ProfileSuggestions";
import { Paper, Typography } from "@mui/material";

export default function OnboardingFlow() {
  const [profile, setProfile] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [finalProfile, setFinalProfile] = useState(null);

  if (finalProfile) {
    return (
      <Paper elevation={3} sx={{ maxWidth: 620, mx: "auto", my: 8, p: 4, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Onboarding Complete!</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Your personalized risk profile is set up.
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          In future steps, you’ll receive bespoke intelligence and real-time alerts based on this profile.
        </Typography>
        <Typography variant="caption" color="grey.700">
          (Continue to dashboard or main app here.)
        </Typography>
      </Paper>
    );
  }

  if (!profile) {
    return (
      <CROOnboardingForm onSubmit={data => { setProfile(data); setIsReviewing(true); }} />
    );
  }

  if (isReviewing) {
    return (
      <CROProfileReview
        profile={profile}
        onEdit={() => { setProfile(null); setIsReviewing(false); }}
        onContinue={() => { setIsReviewing(false); setIsSuggesting(true); }}
      />
    );
  }

  if (isSuggesting) {
    return (
      <ProfileSuggestions onComplete={suggestions => {
        setFinalProfile({ ...profile, enrichedSuggestions: suggestions });
        setIsSuggesting(false);
      }} />
    );
  }

  return null;
}
