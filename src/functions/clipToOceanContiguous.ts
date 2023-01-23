import { PreprocessingHandler } from "@seasketch/geoprocessing";
import { genClipToPolygonPreprocessor } from "../util/genClipToPolygonPreprocessor";

export const clipToContiguous = genClipToPolygonPreprocessor([
  {
    datasourceId: "12_24_nm_boundary",
    operation: "intersect",
  },
]);

export default new PreprocessingHandler(clipToContiguous, {
  title: "clipToOceanContiguous",
  description:
    "Erases portion of sketch overlapping with contiguous zone (12-24 nautical miles)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
