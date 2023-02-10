import {
  PreprocessingHandler,
  genClipToPolygonPreprocessor,
  DatasourceClipOperation,
} from "@seasketch/geoprocessing";
import { genClipOperationLoader } from "@seasketch/geoprocessing/dataproviders";
import project from "../../project";

const operations: DatasourceClipOperation[] = [
  {
    datasourceId: "nearshore",
    operation: "intersect",
  },
];

// Generate function that will fetch features for each clip operation
const clipOpsLoader = genClipOperationLoader(project, operations);

// Generate preprocessing function
export const clipToNearshore = genClipToPolygonPreprocessor(clipOpsLoader);

export default new PreprocessingHandler(clipToNearshore, {
  title: "clipToOceanNearshore",
  description:
    "Erases portion of sketch falling outside of nearshore boundary (0-12nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
