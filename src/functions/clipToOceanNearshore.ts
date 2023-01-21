import { PreprocessingHandler } from "@seasketch/geoprocessing";
import { genClipToPolygonPreprocessor } from "../util/genClipToPolygonPreprocessor";

export const clipToNearshore = genClipToPolygonPreprocessor([
  {
    datasourceId: "nearshore",
    operation: "intersect",
  },
]);

export default new PreprocessingHandler(clipToNearshore, {
  title: "clipToOceanNearshore",
  description:
    "Erases portion of sketch falling outside of nearshore boundary (0-12nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
