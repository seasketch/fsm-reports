import {
  PreprocessingHandler,
  genClipToPolygonPreprocessor,
} from "@seasketch/geoprocessing";
import { genClipOperationLoader } from "@seasketch/geoprocessing/dataproviders";
import project from "../../project";

const clipOperationLoader = genClipOperationLoader(project, [
  {
    datasourceId: "24_200_nm_boundary",
    operation: "intersection",
  },
]);
export const clipToOuterOffshore =
  genClipToPolygonPreprocessor(clipOperationLoader);

export default new PreprocessingHandler(clipToOuterOffshore, {
  title: "clipToOceanOuterOffshore",
  description:
    "Erases portion of sketch falling outside of outer offshore boundary (24-200nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
