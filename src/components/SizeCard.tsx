import React from "react";
import {
  ReportResult,
  percentWithEdge,
  keyBy,
  toNullSketchArray,
  nestMetrics,
  valueFormatter,
  toPercentMetric,
  sortMetricsDisplayOrder,
  isSketchCollection,
} from "@seasketch/geoprocessing/client-core";
import {
  ClassTable,
  Collapse,
  Column,
  ReportTableStyled,
  ResultsCard,
  Table,
  useSketchProperties,
  ToolbarCard,
  DataDownload,
  Card,
  InfoStatus,
} from "@seasketch/geoprocessing/client-ui";
import styled from "styled-components";
import project from "../../project";
import { squareMeterToKilometer } from "@seasketch/geoprocessing";
import { shouldIncludeContiguous } from "../util/includeContiguousSketch";

const boundaryMetricGroup = project.getMetricGroup("boundaryAreaOverlap");
const boundaryTotalMetrics = project.getPrecalcMetrics(
  boundaryMetricGroup,
  "area"
);

const METRIC_ID = boundaryMetricGroup.metricId;
const PERC_METRIC_ID = `${boundaryMetricGroup.metricId}Perc`;

const Number = new Intl.NumberFormat("en", { style: "decimal" });

const TableStyled = styled(ReportTableStyled)`
  font-size: 12px;
  td {
    text-align: right;
  }

  tr:nth-child(1) > th:nth-child(n + 1) {
    text-align: center;
  }

  tr:nth-child(2) > th:nth-child(n + 1) {
    text-align: center;
  }

  tr > td:nth-child(1),
  tr > th:nth-child(1) {
    border-right: 1px solid #777;
  }

  tr:nth-child(1) > th:nth-child(2) {
    border-right: 1px solid #777;
  }

  tr > td:nth-child(3),
  tr > th:nth-child(3) {
    border-right: 1px solid #777;
  }
  tr > td:nth-child(5),
  tr > th:nth-child(5) {
    border-right: 1px solid #777;
  }
`;

const SizeCard = () => {
  const [{ isCollection }] = useSketchProperties();
  return (
    <ResultsCard title="Size" functionName="boundaryAreaOverlap" useChildCard>
      {(data: ReportResult) => {
        if (Object.keys(data).length === 0)
          throw new Error("Protection results not found");

        const includeContiguous =
          isSketchCollection(data.sketch) &&
          shouldIncludeContiguous(data.sketch);
        return (
          <>
            <ToolbarCard
              title="Size"
              items={
                <>
                  <DataDownload
                    filename="size"
                    data={data.metrics}
                    formats={["csv", "json"]}
                    placement="left-end"
                  />
                </>
              }
            >
              <p>
                {project.basic.planningAreaPossessive || ""} waters extend from
                the shoreline out to 200 nautical miles, known as the Exclusive
                Economic Zone (EEZ). This report summarizes offshore plan
                overlap with the EEZ and other boundaries within it, measuring
                progress towards achieving % targets for each boundary.
              </p>
              {genSingleSizeTable(data)}
              {isCollection && (
                <Collapse title="Show by MPA">
                  {genNetworkSizeTable(data)}
                </Collapse>
              )}
              <Collapse title="Learn more">
                <p>
                  <img
                    src={require("../assets/img/territorial_waters.png")}
                    style={{ maxWidth: "100%" }}
                  />
                  <a
                    target="_blank"
                    href="https://en.wikipedia.org/wiki/Territorial_waters"
                  >
                    Source: Wikipedia - Territorial Waters
                  </a>
                </p>
                <p>
                  {" "}
                  This report summarizes the size and proportion of this plan
                  within these boundaries.
                </p>
                <p>
                  If MPA boundaries overlap with each other, the overlap is only
                  counted once.
                </p>
              </Collapse>
            </ToolbarCard>
          </>
        );
      }}
    </ResultsCard>
  );
};

const genSingleSizeTable = (data: ReportResult) => {
  const classesById = keyBy(boundaryMetricGroup.classes, (c) => c.classId);
  let singleMetrics = data.metrics.filter(
    (m) => m.sketchId === data.sketch.properties.id
  );

  const finalMetrics = sortMetricsDisplayOrder(
    [
      ...singleMetrics,
      ...toPercentMetric(singleMetrics, boundaryTotalMetrics, PERC_METRIC_ID),
    ],
    "classId",
    ["eez", "offshore", "contiguous"]
  );

  const aggMetrics = nestMetrics(finalMetrics, ["classId", "metricId"]);

  // Use sketch ID for each table row, index into aggMetrics
  const rows = Object.keys(aggMetrics).map((classId) => ({ classId }));

  const areaColumns: Column<{ classId: string }>[] = [
    {
      Header: " ",
      accessor: (row) => <b>{classesById[row.classId || "missing"].display}</b>,
    },
    {
      Header: "Area Within Plan",
      accessor: (row) => {
        const value = aggMetrics[row.classId][METRIC_ID][0].value;
        return (
          Number.format(Math.round(squareMeterToKilometer(value))) + " sq. km."
        );
      },
    },
    {
      Header: "% Within Plan",
      accessor: (row) => {
        const value = aggMetrics[row.classId][PERC_METRIC_ID][0].value;
        return percentWithEdge(value);
      },
    },
  ];

  return (
    <>
      <ClassTable
        rows={finalMetrics}
        metricGroup={boundaryMetricGroup}
        objective={project.getMetricGroupObjectives(boundaryMetricGroup)}
        columnConfig={[
          {
            columnLabel: "Boundary",
            type: "class",
            width: 25,
          },
          {
            columnLabel: "Found Within Plan",
            type: "metricValue",
            metricId: METRIC_ID,
            valueFormatter: (val: string | number) =>
              Number.format(
                Math.round(
                  squareMeterToKilometer(
                    typeof val === "string" ? parseInt(val) : val
                  )
                )
              ),
            valueLabel: "sq. km.",
            width: 20,
          },
          {
            columnLabel: " ",
            type: "metricChart",
            metricId: PERC_METRIC_ID,
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
                  `${valueFormatter(value / 100, "percent0dig")} Target`;
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
    </>
  );
};

const genNetworkSizeTable = (data: ReportResult) => {
  const sketches = toNullSketchArray(data.sketch);
  const sketchesById = keyBy(sketches, (sk) => sk.properties.id);
  const sketchIds = sketches.map((sk) => sk.properties.id);
  const sketchMetrics = data.metrics.filter(
    (m) => m.sketchId && sketchIds.includes(m.sketchId)
  );
  const finalMetrics = [
    ...sketchMetrics,
    ...toPercentMetric(sketchMetrics, boundaryTotalMetrics, PERC_METRIC_ID),
  ];

  const aggMetrics = nestMetrics(finalMetrics, [
    "sketchId",
    "classId",
    "metricId",
  ]);
  // Use sketch ID for each table row, index into aggMetrics
  const rows = Object.keys(aggMetrics).map((sketchId) => ({
    sketchId,
  }));

  const classColumns: Column<{ sketchId: string }>[] =
    boundaryMetricGroup.classes.map((curClass, index) => ({
      Header: curClass.display,
      style: { color: "#777" },
      columns: [
        {
          Header: "Area" + " ".repeat(index),
          accessor: (row) => {
            const value =
              aggMetrics[row.sketchId][curClass.classId as string][METRIC_ID][0]
                .value;
            return (
              Number.format(Math.round(squareMeterToKilometer(value))) +
              " sq. km."
            );
          },
        },
        {
          Header: "% Area" + " ".repeat(index),
          accessor: (row) => {
            const value =
              aggMetrics[row.sketchId][curClass.classId as string][
                PERC_METRIC_ID
              ][0].value;
            return percentWithEdge(value);
          },
        },
      ],
    }));

  const columns: Column<any>[] = [
    {
      Header: " ",
      accessor: (row) => <b>{sketchesById[row.sketchId].properties.name}</b>,
    },
    ...classColumns,
  ];

  return (
    <TableStyled>
      <Table columns={columns} data={rows} />
    </TableStyled>
  );
};

export default SizeCard;
