import React from "react";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import SizeCard from "../components/SizeCard";
import FishingEffortHoursCard from "../components/FishingEffortHoursCard";
import FishingEffortCatchCard from "../components/FishingEffortCatchCard";

const ReportPage = () => {
  return (
    <>
      <SizeCard />
      <FishingEffortHoursCard />
      <FishingEffortCatchCard />
      <SketchAttributesCard autoHide />
    </>
  );
};

export default ReportPage;
