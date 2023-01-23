import { PreprocessingHandler } from "@seasketch/geoprocessing";
import { genClipToPolygonPreprocessor } from "../util/genClipToPolygonPreprocessor";

export const clipToOuterOffshore = genClipToPolygonPreprocessor([
  {
    datasourceId: "24_200_nm_boundary",
    operation: "intersect",
  },
]);

export default new PreprocessingHandler(clipToOuterOffshore, {
  title: "clipToOceanOuterOffshore",
  description:
    "Erases portion of sketch falling outside of outer offshore boundary (24-200nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
