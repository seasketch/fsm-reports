import React from "react";
import DepthZonesCard from "../components/DepthZonesCard";
import EnvRegionsCard from "../components/EnvRegionsCard";
import SeafloorFeaturesCard from "../components/SeafloorFeaturesCard";

const ReportPage = () => {
  return (
    <>
      <DepthZonesCard />
      <EnvRegionsCard />
      <SeafloorFeaturesCard />
    </>
  );
};

export default ReportPage;
