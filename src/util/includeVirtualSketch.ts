import {
  Polygon,
  SketchCollection,
  getUserAttribute,
  NullSketchCollection,
} from "@seasketch/geoprocessing";

/**
 * Returns true if contiguous zone should be included in the given sketch collection
 */
export const includeContiguous = (
  collection: SketchCollection<Polygon> | NullSketchCollection
) => {
  const val = getUserAttribute(
    collection.properties,
    "include_12-24_nm_contiguous_zone"
  );
  return isTrueAttributeValue(val);
};

//// Helper methods ////

export const isTrueAttributeValue = (value: unknown) => {
  return value === "Yes" || value === "yes" || value === true ? true : false;
};
