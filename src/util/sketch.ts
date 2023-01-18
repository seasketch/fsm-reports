import {
  LineString,
  MultiPolygon,
  Polygon,
  Sketch,
  SketchCollection,
  SketchGeometryTypes,
  UserAttribute,
} from "@seasketch/geoprocessing";
import { v4 as uuid } from "uuid";
import bbox from "@turf/bbox";
import { Feature, featureCollection, polygon } from "@turf/helpers";

/**
 * Returns a Sketch with given features geometry and properties. Reasonable defaults are given for properties not provided
 * Default geometry is a square from 0,0 to 1,1
 */
export const genSketch = <G = SketchGeometryTypes>(
  options: {
    feature?: Feature<G>;
    name?: string;
    id?: string;
    userAttributes?: UserAttribute[];
    sketchClassId?: string;
    createdAt?: string;
    updatedAt?: string;
  } = {}
): Sketch<G> => {
  const {
    feature = polygon([
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
    ]) as Feature<G>,
    name = `sketch-${uuid()}`,
    id = uuid(),
    userAttributes = [],
    sketchClassId = uuid(),
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  } = options;
  return {
    ...feature,
    properties: {
      id,
      isCollection: false,
      userAttributes,
      sketchClassId,
      createdAt,
      updatedAt,
      name,
    },
    bbox: bbox(feature.geometry),
  };
};

/**
 * Given array of sketches, return a sketch collection with given properties.
 * Generates reasonable default values for any properties not passed in
 * The geometry type of the returned collection will match the one passed in
 * @param geometry
 */
export const genSketchCollection = <G = SketchGeometryTypes>(
  sketches: Sketch<G>[],
  options: {
    name?: string;
    id?: string;
    userAttributes?: UserAttribute[];
    sketchClassId?: string;
    createdAt?: string;
    updatedAt?: string;
  } = {}
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
