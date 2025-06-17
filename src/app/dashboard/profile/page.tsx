"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { StatesCard } from "@/components/states-card";
import { PersonalInfoCard } from "@/features/dashboard/profile/components/personal-info-card";
import Container from "@mui/material/Container";

export default function Profile() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));
  return (
    <div className="flex h-auto w-full p-4">
    
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "flex-start", 

        }}
      >
        <PersonalInfoCard />
     
        <StatesCard />
      </Box>
    
    </div>
  );
}
