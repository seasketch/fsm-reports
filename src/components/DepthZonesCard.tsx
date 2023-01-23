import React from "react";
import {
  Collapse,
  ResultsCard,
  SketchClassTable,
  ClassTable,
  useSketchProperties,
  LayerToggle,
  ToolbarCard,
} from "@seasketch/geoprocessing/client-ui";
import {
  ReportResult,
  toNullSketchArray,
  flattenBySketchAllClass,
  metricsWithSketchId,
  toPercentMetric,
  valueFormatter,
} from "@seasketch/geoprocessing/client-core";
import project from "../../project";

const metricGroup = project.getMetricGroup("depthZoneValueOverlap");
const precalcMetrics = project.getPrecalcMetrics(
  metricGroup,
  "sum",
  metricGroup.classKey
);

const Card = () => {
  const [{ isCollection }] = useSketchProperties();
  return (
    <>
      <ResultsCard
        title="Depth Zones"
        functionName="depthZoneValueOverlap"
        useChildCard
      >
        {(data: ReportResult) => {
          // Single sketch or collection top-level
          const topLevelMetrics = metricsWithSketchId(
            toPercentMetric(
              data.metrics.filter((m) => m.metricId === metricGroup.metricId),
              precalcMetrics
            ),
            [data.sketch.properties.id]
          );

          return (
            <ToolbarCard
              title="Depth Zone"
              items={
                <LayerToggle label="Map" layerId={metricGroup.layerId} simple />
              }
            >
              <p>
                The seabottom supports different ecological communities
                depending on its depth. Offshore plans should consider including
                areas at each depth zone.
              </p>

              <ClassTable
                rows={topLevelMetrics}
                metricGroup={metricGroup}
                objective={project.getMetricGroupObjectives(metricGroup)}
                columnConfig={[
                  {
                    columnLabel: "Depth Zone",
                    type: "class",
                    width: 25,
                  },
                  {
                    columnLabel: "% Found Within Plan",
                    type: "metricChart",
                    metricId: metricGroup.metricId,
                    valueFormatter: "percent",
                    chartOptions: {
                      showTitle: true,
                      showTargetLabel: true,
                      targetLabelPosition: "bottom",
                      targetLabelStyle: "tight",
                      barHeight: 11,
                    },
                    width: 60,
                    targetValueFormatter: (
                      value: number,
                      row: number,
                      numRows: number
                    ) => {
                      if (row === 0) {
                        return (value: number) =>
                          `${valueFormatter(
                            value / 100,
                            "percent0dig"
                          )} Target`;
                      } else {
                        return (value: number) =>
                          `${valueFormatter(value / 100, "percent0dig")}`;
                      }
                    },
                  },
                  {
                    type: "layerToggle",
                    width: 15,
                    columnLabel: "Map",
                  },
                ]}
              />

              {isCollection && (
                <Collapse title="Show by MPA">{genSketchTable(data)}</Collapse>
              )}

              <Collapse title="Learn more">
                <p>
                  ℹ️ Overview: Depth zones represent distinct environmental
                  conditions and, therefore, ecological communities. Plans
                  should ensure the representative coverage of each depth zone,
                  and the distinct ecological communities they sustain.
                </p>
                <p>
                  🎯 Planning Objective: include at least 20% of each depth zone
                </p>
                <p>
                  🗺️ Source Data:{" "}
                  <a href="https://www.gebco.net/" target="_blank">
                    GEBCO
                  </a>{" "}
                  bathymetry digital elevation models were grouped into depth
                  zones
                </p>
                <p>
                  📈 Report: The percentage of each depth zone within this plan
                  is calculated by finding the overlap of each depth zone with
                  the plan, summing its area, then dividing it by the total area
                  of each depth zone within the EEZ. If the plan includes
                  multiple areas that overlap, the overlap is only counted once.
                </p>
              </Collapse>
            </ToolbarCard>
          );
        }}
      </ResultsCard>
    </>
  );
};

const genSketchTable = (data: ReportResult) => {
  const childSketches = toNullSketchArray(data.sketch);
  const childSketchIds = childSketches.map((sk) => sk.properties.id);
  const childSketchMetrics = toPercentMetric(
    metricsWithSketchId(data.metrics, childSketchIds),
    precalcMetrics
  );
  const sketchRows = flattenBySketchAllClass(
    childSketchMetrics,
    metricGroup.classes,
    childSketches
  );

  return (
    <SketchClassTable rows={sketchRows} metricGroup={metricGroup} formatPerc />
  );
};

export default Card;
