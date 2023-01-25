import React from "react";
import DepthZonesCard from "../components/DepthZonesCard";
import EnvRegionsCard from "../components/EnvRegionsCard";
import SeafloorFeaturesCard from "../components/SeafloorFeaturesCard";
import SeafloorSpeciesCard from "../components/SeafloorSpeciesCard";

const ReportPage = () => {
  return (
    <>
      <DepthZonesCard />
      <EnvRegionsCard />
      <SeafloorFeaturesCard />
      <SeafloorSpeciesCard />
    </>
  );
};

export default ReportPage;
