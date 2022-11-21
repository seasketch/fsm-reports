import React, { useState } from "react";
import { SegmentControl, ReportPage } from "@seasketch/geoprocessing/client-ui";
import ViabilityPage from "./ViabilityPage";

const enableAllTabs = false;
const AllReports = () => {
  const [tab, setTab] = useState<string>("Viability");
  return (
    <>
      <div style={{ marginTop: 5 }}>
        <SegmentControl
          value={tab}
          onClick={(segment) => setTab(segment)}
          segments={["Viability"]}
        />
      </div>
      <ReportPage hidden={!enableAllTabs && tab !== "Viability"}>
        <ViabilityPage />
      </ReportPage>
    </>
  );
};

export default AllReports;