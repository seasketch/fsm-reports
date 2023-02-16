import {
  PreprocessingHandler,
  genPreprocessor,
} from "@seasketch/geoprocessing";
import { genClipLoader } from "@seasketch/geoprocessing/dataproviders";
import project from "../../project";

const clipLoader = genClipLoader(project, [
  {
    datasourceId: "24_200_nm_boundary",
    operation: "intersection",
  },
]);
export const clipToOuterOffshore = genPreprocessor(clipLoader);

export default new PreprocessingHandler(clipToOuterOffshore, {
  title: "clipToOceanOuterOffshore",
  description:
    "Erases portion of sketch falling outside of outer offshore boundary (24-200nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
