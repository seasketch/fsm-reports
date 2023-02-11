import {
  PreprocessingHandler,
  genClipToPolygonPreprocessor,
} from "@seasketch/geoprocessing";
import { genClipOperationLoader } from "@seasketch/geoprocessing/dataproviders";
import project from "../../project";

const clipOpsLoader = genClipOperationLoader(project, [
  {
    datasourceId: "nearshore",
    operation: "intersect",
  },
]);
export const clipToNearshore = genClipToPolygonPreprocessor(clipOpsLoader);

export default new PreprocessingHandler(clipToNearshore, {
  title: "clipToOceanNearshore",
  description:
    "Erases portion of sketch falling outside of nearshore boundary (0-12nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
