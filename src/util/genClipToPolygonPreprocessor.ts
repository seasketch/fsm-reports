import {
  ValidationError,
  isPolygonFeature,
  Feature,
  Polygon,
  MultiPolygon,
  getFlatGeobufFilename,
  isInternalVectorDatasource,
  clipMultiMerge,
  getLandVectorDatasource,
  getEezVectorDatasource,
  Datasource,
} from "@seasketch/geoprocessing";
import { fgbFetchAll } from "@seasketch/geoprocessing/dataproviders";
import area from "@turf/area";
import { featureCollection as fc, featureCollection } from "@turf/helpers";
import flatten from "@turf/flatten";
import kinks from "@turf/kinks";
import project from "../../project";
import bbox from "@turf/bbox";

// Defined at module level for potential caching/reuse by serverless process
const landVectorDatasource = getLandVectorDatasource(project.datasources);
const eezVectorDatasource = getEezVectorDatasource(project.datasources);

/**
 * Returns an async preprocessor function that clips a given
 * polygon/multipology feature to be completely within given
 * datasources polygons.
 * Optional accepts maxSize in square kilometers that clipped polygon
 * result can be.  Preprocessor function will throw if larger.
 */
export const genClipToPolygonPreprocessor = (
  clipOperations: Array<{
    datasourceId: string;
    operation: "intersect" | "difference";
  }>,
  options: {
    /** Ensures result is a polygon. If clip results in multipolygon, returns the largest component */
    ensurePolygon?: boolean;
    maxSize?: number;
  } = {}
) => {
  const func = (feature: Feature): Promise<Feature> =>
    clipToPolygonDatasources(clipOperations, feature, options);
  return func;
};

/**
 * Takes a Polygon feature and returns the portion that is in the ocean and within an EEZ boundary
 * If results in multiple polygons then returns the largest
 * @throws if clipped features is larger than maxSize, defaults to 500K km
 */
export async function clipToPolygonDatasources(
  /** List of clip operations to run on feature in sequential order against given datasource  */
  clipOperations: Array<{
    datasourceId: string;
    operation: "intersect" | "difference";
  }>,
  feature: Feature,
  options: {
    maxSize?: number;
    enforceMaxSize?: boolean;
    ensurePolygon?: boolean;
  } = {}
): Promise<Feature> {
  const {
    maxSize = 500000,
    enforceMaxSize = false,
    ensurePolygon = true,
  } = options;

  //// INITIAL CHECKS ////

  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  const MAX_SIZE_KM = maxSize * 1000 ** 2;

  if (enforceMaxSize && area(feature) > MAX_SIZE_KM) {
    throw new ValidationError(
      `Please limit sketches to under ${MAX_SIZE_KM} square km`
    );
  }

  const kinkPoints = kinks(feature);
  if (kinkPoints.features.length > 0) {
    throw new ValidationError("Your sketch polygon crosses itself.");
  }

  let clipped: Feature<Polygon | MultiPolygon> | null = feature; // Start with whole feature

  //// CLIP OPERATIONS ////

  // Sequentially run clip operations in order.  If operation returns null at some point, don't do any more ops
  for (const clipOp of clipOperations) {
    if (clipped !== null && clipOp.operation === "intersect") {
      clipped = await intersectPolygonDatasource(clipOp.datasourceId, clipped);
    }
  }

  if (!clipped || area(clipped) === 0) {
    throw new ValidationError("Sketch is outside of boundary");
  } else {
    if (ensurePolygon && clipped.geometry.type === "MultiPolygon") {
      // If multipolygon, keep only the biggest piece
      const flattened = flatten(clipped);
      let biggest = [0, 0];
      for (var i = 0; i < flattened.features.length; i++) {
        const a = area(flattened.features[i]);
        if (a > biggest[0]) {
          biggest = [a, i];
        }
      }
      return flattened.features[biggest[1]] as Feature<Polygon>;
    } else {
      return clipped;
    }
  }
}

export async function intersectPolygonDatasource(
  datasourceName: string,
  feature: Feature<Polygon | MultiPolygon>
) {
  const ds = project.getDatasourceById(datasourceName);
  const polys = await getVectorFeaturesByDatasource(ds, feature);
  return clipMultiMerge(feature, fc(polys), "intersection");
}

/**
 * Given polygon/multipolygon features returns vector features for given datasource within the bbox of that feature.
 * Inspects datasource type and automatically fetches using appropriate method
 * @todo: add support for external datasources and all formats
 */
export async function getVectorFeaturesByDatasource(
  ds: Datasource,
  feature: Feature<Polygon | MultiPolygon>
) {
  const featureBox = bbox(feature);
  let polys: Feature<Polygon>[];
  if (isInternalVectorDatasource(ds)) {
    const url = `${project.dataBucketUrl()}${getFlatGeobufFilename(ds)}`;
    console.log("url", url);
    // Fetch for entire project area, we want the whole thing
    polys = await fgbFetchAll<Feature<Polygon>>(url, featureBox);
  } else {
    throw new Error(`Expected vector datasource for ${ds.datasourceId}`);
  }
  return polys;
}
