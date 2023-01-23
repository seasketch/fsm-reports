import {
  GeoprocessingHandler,
  Metric,
  Polygon,
  ReportResult,
  Sketch,
  SketchCollection,
  toNullSketch,
  rekeyMetrics,
  sortMetrics,
  overlapRaster,
  getCogFilename,
  isSketchCollection,
} from "@seasketch/geoprocessing";
import { loadCogWindow } from "@seasketch/geoprocessing/dataproviders";
import { includeContiguous } from "../util/includeContiguousSketch";
import bbox from "@turf/bbox";
import project from "../../project";

const metricGroup = project.getMetricGroup("depthZoneValueOverlap");

export async function depthZoneValueOverlap(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>
): Promise<ReportResult> {
  const finalSketch = isSketchCollection(sketch)
    ? includeContiguous(sketch)
    : sketch;

  const box = finalSketch.bbox || bbox(finalSketch);
  const metrics: Metric[] = (
    await Promise.all(
      metricGroup.classes.map(async (curClass) => {
        // start raster load and move on in loop while awaiting finish
        if (!curClass.datasourceId)
          throw new Error(`Expected datasourceId for ${curClass}`);
        const url = `${project.dataBucketUrl()}${getCogFilename(
          curClass.datasourceId
        )}`;
        const raster = await loadCogWindow(url, {});
        // start analysis as soon as source load done
        const overlapResult = await overlapRaster(
          metricGroup.metricId,
          raster,
          finalSketch
        );
        return overlapResult.map(
          (metrics): Metric => ({
            ...metrics,
            classId: curClass.classId,
          })
        );
      })
    )
  ).reduce(
    // merge
    (metricsSoFar, curClassMetrics) => [...metricsSoFar, ...curClassMetrics],
    []
  );

  return {
    metrics: sortMetrics(rekeyMetrics(metrics)),
    sketch: toNullSketch(finalSketch, true),
  };
}

export default new GeoprocessingHandler(depthZoneValueOverlap, {
  title: "depthZoneValueOverlap",
  description: "metrics for sketch overlap with ocean depth zones",
  timeout: 120, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 10240,
});
