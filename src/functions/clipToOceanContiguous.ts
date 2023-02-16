import {
  PreprocessingHandler,
  genPreprocessor,
} from "@seasketch/geoprocessing";
import { genClipLoader } from "@seasketch/geoprocessing/dataproviders";
import project from "../../project";

const clipLoader = genClipLoader(project, [
  {
    datasourceId: "12_24_nm_boundary",
    operation: "intersection",
  },
]);
export const clipToContiguous = genPreprocessor(clipLoader);

export default new PreprocessingHandler(clipToContiguous, {
  title: "clipToOceanContiguous",
  description:
    "Erases portion of sketch overlapping with contiguous zone (12-24 nautical miles)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
