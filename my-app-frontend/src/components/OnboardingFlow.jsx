import React, { useState } from "react";
import CROOnboardingForm from "./CROOnboardingForm";
import CROProfileReview from "./CROProfileReview";
import ProfileSuggestions from "./ProfileSuggestions";
import Dashboard from "./Dashboard";
import { Paper, Typography } from "@mui/material";

export default function OnboardingFlow() {
  const [profile, setProfile] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [finalProfile, setFinalProfile] = useState(null);

  if (finalProfile) {
    console.log('Rendering Dashboard with profileId:', finalProfile.id);
    console.log('Final profile data:', finalProfile);
    return <Dashboard profileId={finalProfile.id} />;
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
