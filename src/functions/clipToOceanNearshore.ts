import {
  PreprocessingHandler,
  genClipToPolygonPreprocessor,
} from "@seasketch/geoprocessing";
import { genClipOperationLoader } from "@seasketch/geoprocessing/dataproviders";
import project from "../../project";

const clipOperationLoader = genClipOperationLoader(project, [
  {
    datasourceId: "nearshore",
    operation: "intersection",
  },
]);
export const clipToNearshore =
  genClipToPolygonPreprocessor(clipOperationLoader);

export default new PreprocessingHandler(clipToNearshore, {
  title: "clipToOceanNearshore",
  description:
    "Erases portion of sketch falling outside of nearshore boundary (0-12nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
