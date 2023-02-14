import {
  PreprocessingHandler,
  genClipToPolygonPreprocessor,
} from "@seasketch/geoprocessing";
import project from "../../project";
import { genClipOperationLoader } from "@seasketch/geoprocessing/dataproviders";

const clipOperationLoader = genClipOperationLoader(project, [
  {
    datasourceId: "global-clipping-osm-land",
    operation: "difference",
    options: {
      unionProperty: "gid",
    },
  },
  {
    datasourceId: "global-clipping-eez-land-union",
    operation: "intersection",
    options: {
      propertyFilter: {
        property: "UNION",
        values: ["Micronesia"],
      },
    },
  },
]);

export const clipToOceanEez = genClipToPolygonPreprocessor(clipOperationLoader);

export default new PreprocessingHandler(clipToOceanEez, {
  title: "clipToOceanEez",
  description:
    "Erases portion of sketch overlapping with land or extending into ocean outsize EEZ boundary (0-200nm)",
  timeout: 40,
  requiresProperties: [],
  memory: 4096,
});
