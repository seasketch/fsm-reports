import { PreprocessingHandler } from "@seasketch/geoprocessing";
import { genClipToPolygonPreprocessor } from "../util/genClipToPolygonPreprocessor";

export const clipToOffshore = genClipToPolygonPreprocessor([
  {
    datasourceId: "offshore",
    operation: "intersect",
  },
]);

export default new PreprocessingHandler(clipToOffshore, {
  title: "clipToOceanOffshore",
  description: "Erases portion of sketch falling outside of offshore boundary",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
