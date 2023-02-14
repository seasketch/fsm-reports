import {
  PreprocessingHandler,
  genClipToPolygonPreprocessor,
} from "@seasketch/geoprocessing";
import { genClipOperationLoader } from "@seasketch/geoprocessing/dataproviders";
import project from "../../project";

const clipOperationLoader = genClipOperationLoader(project, [
  {
    datasourceId: "offshore",
    operation: "intersection",
  },
]);
export const clipToOffshore = genClipToPolygonPreprocessor(clipOperationLoader);

export default new PreprocessingHandler(clipToOffshore, {
  title: "clipToOceanOffshore",
  description:
    "Erases portion of sketch falling outside of offshore boundary (12-200nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
