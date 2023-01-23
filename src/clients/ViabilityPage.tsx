import React from "react";
import SizeCard from "../components/SizeCard";
import ContiguousZoneCard from "../components/ContiguousZoneCard";
import FishingEffortHoursCard from "../components/FishingEffortHoursCard";
import FishingEffortCatchCard from "../components/FishingEffortCatchCard";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";

const ReportPage = () => {
  return (
    <>
      <SketchAttributesCard autoHide />
      <ContiguousZoneCard autoHide />
      <SizeCard />
      <FishingEffortHoursCard />
      <FishingEffortCatchCard />
    </>
  );
};

export default ReportPage;
