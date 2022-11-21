import React from "react";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import SizeCard from "../components/SizeCard";

const ReportPage = () => {
  return (
    <>
      <SizeCard />
      <SketchAttributesCard autoHide />
    </>
  );
};

export default ReportPage;
