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

const metricGroup = project.getMetricGroup("gfwEffortValueOverlap");
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
        title="Fishing Effort - Hours"
        functionName="gfwEffortValueOverlap"
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
              title="Fishing Effort - Hours"
              items={
                <LayerToggle label="Map" layerId={metricGroup.layerId} simple />
              }
            >
              <p>
                This report summarizes the percentage of fishing effort within
                this offshore plan, based on an average of the fishing effort
                from 2017-2020 from Global Fishing Watch. The higher the
                percentage, the greater the potential impact to the fishery if
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
                    width: 30,
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
                    width: 40,
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
                ]}
              />

              {isCollection && (
                <Collapse title="Show by MPA">{genSketchTable(data)}</Collapse>
              )}

              <Collapse title="Learn more">
                <p>
                  ℹ️ Hours of fishing effort is used as a proxy for measuring
                  the potential economic loss to fisheries caused by the
                  creation of protected areas. This report can be used to
                  minimize the potential impact of a plan to fisheries, as well
                  as identify and reduce conflict between conservation
                  objectives and fishing activities. The higher the percentage,
                  the greater the potential impact if access or activities are
                  restricted.
                </p>
                <p>
                  🎯 Planning Objective: there is no specific objective/target
                  for limiting the potential impact to fishing activities.
                </p>
                <p>
                  🗺️ Source Data: Global Fishing Watch harvests, analyzes, and
                  distributes Automatic Identification System (AIS) location
                  data from vessels with transponders. AIS uses existing
                  satellites and land-based receivers to collect location data
                  on a vessel’s location, and Global Fishing Watch is able to
                  use machine learning to estimate useful metrics, including:
                  whether the vessel is fishing or not, the kind of fishing gear
                  is being used and match these metrics to vessel information,
                  including vessel size and vessel flag. AIS data gaps can occur
                  in remote areas or areas with high vessel density if receivers
                  are limited.
                </p>
                <p>
                  <b>Apparent fishing effort</b> is measured using transmissions
                  (or "pings") broadcast by fishing vessels using the automatic
                  identification system (AIS) vessel tracking system.
                </p>
                <p>
                  Machine learning models are then used to classify fishing
                  vessels and predict when they are fishing based on their
                  movement patterns and changes in speed.
                </p>
                <p>
                  Apparent fishing effort can then be calculated for any area by
                  summarizing the fishing hours for all fishing vessels in that
                  area.
                </p>
                <p>
                  📈 Report: Percentages are calculated by summing the total
                  amount of fishing effort (in hours) within the MPAs in this
                  plan, and dividing it by the total amount of fishing effort
                  (in hours) across the overall planning area. If the plan
                  includes multiple areas that overlap, the overlap is only
                  counted once.
                </p>
                <p>
                  There are a number of caveats and limitations to this data.
                  For further information:{" "}
                  <a
                    target="_blank"
                    href={`${project.basic.externalLinks.gfwFishingEffort}`}
                  >
                    Global Fishing Watch - Apparent Fishing Effort
                  </a>
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
