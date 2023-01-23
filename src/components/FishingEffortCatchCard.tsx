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

const metricGroup = project.getMetricGroup("normaCatchValueOverlap");
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
        title="Fishing Effort - Catch"
        functionName="normaCatchValueOverlap"
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
              title="Fishing Effort - Catch"
              items={
                <LayerToggle label="Map" layerId={metricGroup.layerId} simple />
              }
            >
              <p>
                This report summarizes the percentage of fish caught within this
                offshore plan, based on the average annual catch from 2017-2020.
                Plans should consider the potential impact to fisheries if
                access or activities are restricted.
              </p>

              <ClassTable
                rows={topLevelMetrics}
                metricGroup={metricGroup}
                objective={undefined}
                columnConfig={[
                  {
                    columnLabel: "Gear Type",
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
                  ℹ️ Fish catch is used as a proxy for measuring the potential
                  economic loss to fisheries caused by the creation of protected
                  areas. This report can be used to minimize the potential
                  impact of a plan to fisheries, as well as identify and reduce
                  conflict between conservation objectives and fishing
                  activities. The higher the percentage, the greater the
                  potential impact if access or activities are restricted.
                </p>
                <p>
                  🎯 Planning Objective: there is no specific objective/target
                  for limiting the potential impact to fishing activities.
                </p>
                <p>
                  🗺️ Source Data: Catch data collected by observers were
                  provided by National Oceanic Resource Management Authority
                  (NORMA).
                  <ul>
                    <li>Purse seine: 2010-2021</li>
                    <li>Longline: 2010-2021</li>
                    <li>Pole and line: 2010-2020</li>
                  </ul>
                </p>
                <p>
                  📈 Report: Percentages are calculated by summing the hours of
                  fishing effort within the MPAs in this plan, and dividing it
                  by the total area of fishing effort in the overall planning
                  area. If the plan includes multiple areas that overlap, the
                  overlap is only counted once.
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
