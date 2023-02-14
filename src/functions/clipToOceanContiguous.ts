import {
  PreprocessingHandler,
  genClipToPolygonPreprocessor,
} from "@seasketch/geoprocessing";
import { genClipOperationLoader } from "@seasketch/geoprocessing/dataproviders";
import project from "../../project";

const clipOperationLoader = genClipOperationLoader(project, [
  {
    datasourceId: "12_24_nm_boundary",
    operation: "intersection",
  },
]);
export const clipToContiguous =
  genClipToPolygonPreprocessor(clipOperationLoader);

export default new PreprocessingHandler(clipToContiguous, {
  title: "clipToOceanContiguous",
  description:
    "Erases portion of sketch overlapping with contiguous zone (12-24 nautical miles)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
