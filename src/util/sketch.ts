import {
  FeatureCollection,
  LineString,
  MultiPolygon,
  Polygon,
  Sketch,
  SketchCollection,
  UserAttribute,
} from "@seasketch/geoprocessing";
import { v4 as uuid } from "uuid";
import bbox from "@turf/bbox";
import { featureCollection } from "@turf/helpers";

/**
 * Returns a Sketch with given geometry and properties. Reasonable defaults are given for properties not provided
 */
export const genSketch = <G = Polygon | MultiPolygon | LineString | String>(
  geometry: G,
  options: {
    name?: string;
    id?: string;
    userAttributes?: UserAttribute[];
    sketchClassId?: string;
    createdAt?: string;
    updatedAt?: string;
  }
): Sketch<G> => {
  const {
    name = `sketch-${uuid()}`,
    id = uuid(),
    userAttributes = [],
    sketchClassId = uuid(),
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  } = options;
  return {
    type: "Feature",
    properties: {
      id,
      isCollection: false,
      userAttributes,
      sketchClassId,
      createdAt,
      updatedAt,
      name,
    },
    geometry,
    bbox: bbox(geometry),
  };
};

/**
 * Given array of sketches, return a sketch collection with given properties.
 * Generates reasonable default values for any properties not passed in
 * The geometry type of the returned collection will match the one passed in
 * @param geometry
 */
export const genSketchCollection = <G = Polygon | LineString | String>(
  sketches: Sketch<G>[],
  options: {
    name?: string;
    id?: string;
    userAttributes?: UserAttribute[];
    sketchClassId?: string;
    createdAt?: string;
    updatedAt?: string;
  }
): SketchCollection<G> => {
  const {
    name = `sketch-${uuid()}`,
    id = uuid(),
    userAttributes = [],
    sketchClassId = uuid(),
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  } = options;

  return {
    type: "FeatureCollection",
    features: sketches,
    properties: {
      id,
      isCollection: true,
      userAttributes,
      sketchClassId,
      createdAt,
      updatedAt,
      name,
    },
    bbox: bbox(featureCollection(sketches)),
  };
};
