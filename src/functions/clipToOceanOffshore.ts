import {
  PreprocessingHandler,
  genPreprocessor,
} from "@seasketch/geoprocessing";
import { genClipLoader } from "@seasketch/geoprocessing/dataproviders";
import project from "../../project";

const clipLoader = genClipLoader(project, [
  {
    datasourceId: "offshore",
    operation: "intersection",
  },
]);
export const clipToOffshore = genPreprocessor(clipLoader);

export default new PreprocessingHandler(clipToOffshore, {
  title: "clipToOceanOffshore",
  description:
    "Erases portion of sketch falling outside of offshore boundary (12-200nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
