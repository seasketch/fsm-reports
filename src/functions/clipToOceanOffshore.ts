import {
  PreprocessingHandler,
  genClipToPolygonPreprocessor,
} from "@seasketch/geoprocessing";
import { genClipOperationLoader } from "@seasketch/geoprocessing/dataproviders";
import project from "../../project";

const clipOpsLoader = genClipOperationLoader(project, [
  {
    datasourceId: "offshore",
    operation: "intersect",
  },
]);
export const clipToOffshore = genClipToPolygonPreprocessor(clipOpsLoader);

export default new PreprocessingHandler(clipToOffshore, {
  title: "clipToOceanOffshore",
  description:
    "Erases portion of sketch falling outside of offshore boundary (12-200nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
