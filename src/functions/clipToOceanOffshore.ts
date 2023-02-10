import {
  PreprocessingHandler,
  genClipToPolygonPreprocessor,
  DatasourceClipOperation,
} from "@seasketch/geoprocessing";
import { genClipOperationLoader } from "@seasketch/geoprocessing/dataproviders";
import project from "../../project";

const operations: DatasourceClipOperation[] = [
  {
    datasourceId: "offshore",
    operation: "intersect",
  },
];

// Generate function that will fetch features for each clip operation
const clipOpsLoader = genClipOperationLoader(project, operations);

// Generate preprocessing function
export const clipToOffshore = genClipToPolygonPreprocessor(clipOpsLoader);

export default new PreprocessingHandler(clipToOffshore, {
  title: "clipToOceanOffshore",
  description:
    "Erases portion of sketch falling outside of offshore boundary (12-200nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
