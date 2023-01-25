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

const metricGroup = project.getMetricGroup("benthicSpeciesValueOverlap");
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
        title="Seafloor Habitat Protection - by Species"
        functionName="benthicSpeciesValueOverlap"
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
              title="Seafloor Habitat Protection - by Species"
              items={
                <LayerToggle label="Map" layerId={metricGroup.layerId} simple />
              }
            >
              <p>
                Coral species found on the offshore seafloor provide habitat and
                nursery areas for many other species. Offshore plans should
                include a portion of the areas where these coral species are
                predicted to be present.
              </p>

              <ClassTable
                rows={topLevelMetrics}
                metricGroup={metricGroup}
                objective={project.getMetricGroupObjectives(metricGroup)}
                columnConfig={[
                  {
                    columnLabel: "Species",
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
                  ℹ️ Overview: Plans should ensure the representative coverage
                  of habitat used by each offshore seafloor species. This report
                  summarizes the percentage of the seafloor habitat for each
                  species that overlaps with this plan.
                </p>
                <p>
                  🎯 Planning Objective: include the recommended % of predicted
                  habitat at minimum.
                </p>
                <p>
                  🗺️ Source Data: The predicted presence of octocorals, which
                  are habitats for invertebrates, groundfish, rockfish, and
                  other fish species were modeled by Yesson et al., (2012). The
                  predicted presence of Black Coral (antipatharia) habitat
                  suitability was modeled by Yesson et al., (2017). The
                  predicted presence of cold-water corals, which are important
                  habitat and nursery areas for many species, were modeled by
                  Davies and Guinotte (2011).
                </p>
                <p>
                  📈 Report: The percentage of each species' habitat within this
                  plan is calculated by finding the overlap of each species'
                  habitat with the plan, summing its area, then dividing it by
                  the total area of each species' habitat found within the EEZ.
                  If the plan includes multiple areas that overlap, the overlap
                  is only counted once.
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
