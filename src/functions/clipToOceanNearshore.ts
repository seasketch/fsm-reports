import {
  PreprocessingHandler,
  genPreprocessor,
} from "@seasketch/geoprocessing";
import { genClipLoader } from "@seasketch/geoprocessing/dataproviders";
import project from "../../project";

const clipLoader = genClipLoader(project, [
  {
    datasourceId: "nearshore",
    operation: "intersection",
  },
]);
export const clipToNearshore = genPreprocessor(clipLoader);

export default new PreprocessingHandler(clipToNearshore, {
  title: "clipToOceanNearshore",
  description:
    "Erases portion of sketch falling outside of nearshore boundary (0-12nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
