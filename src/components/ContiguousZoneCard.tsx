import React from "react";
import {
  useSketchProperties,
  Card,
  InfoStatus,
  ToolbarCard,
  LayerToggle,
  VerticalSpacer,
} from "@seasketch/geoprocessing/client-ui";
import { shouldIncludeContiguous } from "../util/includeContiguousSketch";
import project from "../../project";

const metricGroup = project.getMetricGroup("boundaryAreaOverlap");

export interface SketchAttributesCardProps {
  title?: string;
  autoHide?: boolean;
  /** Map from value IDs to human readable for one or more exportIds */
  mappings?: { [exportId: string]: { [value: string]: string } };
}

export const SketchAttributesCard = ({
  title,
  autoHide,
  mappings,
}: SketchAttributesCardProps) => {
  const titleStyle: React.CSSProperties = {
    fontSize: "1em",
    fontWeight: 500,
    color: "#6C7282",
    marginBottom: "1.5em",
  };

  const [properties] = useSketchProperties();
  if (autoHide === true && properties.userAttributes.length === 0) {
    return null;
  }

  const includeContiguous = shouldIncludeContiguous(properties);

  if (properties) {
    if (!includeContiguous) return null;
    return (
      <>
        <ToolbarCard
          title="Contiguous Zone"
          items={
            <LayerToggle
              label="Show Boundary"
              layerId={
                metricGroup.classes.find((c) => c.classId === "contiguous")
                  ?.layerId
              }
              simple
            />
          }
        >
          <VerticalSpacer />
          <InfoStatus
            size={32}
            msg={
              <span>
                You chose to include the contiguous zone as part of your MPA
                network. It's full area will now be counted towards protection
                targets in all reports. Any overlap between the MPA's you have
                drawn and this contiguous zone will only be counted once.
              </span>
            }
          />
        </ToolbarCard>
      </>
    );
  } else {
    return (
      <Card titleStyle={titleStyle} title={title || "Attributes"}>
        <p>No attributes found</p>
      </Card>
    );
  }
};

export default SketchAttributesCard;
