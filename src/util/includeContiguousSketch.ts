import {
  Sketch,
  SketchCollection,
  SketchGeometryTypes,
  SketchProperties,
} from "@seasketch/geoprocessing";
import { getUserAttribute } from "@seasketch/geoprocessing/client-core";
import {
  includeVirtualSketch,
  isTruthyAttributeValue,
} from "./includeVirtualSketch";

import contiguous_zone_sketches from "../../examples/sketches/contiguous_zone_sketches.json";

export const includeContiguous = <G extends SketchGeometryTypes>(
  collection: SketchCollection<G>
) => {
  const contigSketch =
    contiguous_zone_sketches as unknown as SketchCollection<G>;
  return includeVirtualSketch(
    collection,
    contigSketch,
    shouldIncludeContiguous
  );
};

/**
 * Returns true if contiguous zone should be included in the given sketch collection
 */
export const shouldIncludeContiguous = (
  sketchOrProps: Sketch | SketchCollection | SketchProperties
) => {
  const val = getUserAttribute(
    sketchOrProps,
    "include_12-24_nm_contiguous_zone"
  );
  return isTruthyAttributeValue(val);
};
