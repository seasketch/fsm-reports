import { FeatureCollection, SketchProperties } from "@seasketch/geoprocessing";
import { genSketch, genSketchCollection } from "../../src/util/sketch";

/**
 * Converts FeatureCollection to SketchCollection with reasonable defaults given for sketch properties
 * @param fc
 * @param name
 */
export const convertToSketch = (
  fc: FeatureCollection,
  name: string = "sketches",
  sketchProperties: Partial<SketchProperties> = {}
) => {
  const sketchFeatures = fc.features.map((feat, idx) => {
    const idValue = feat.properties?.id || idx + 1;
    const featureName = (() => {
      if (name) {
        if (feat.properties && feat.properties[name]) {
          return feat.properties[name];
        } else {
          return `${name}-${idValue}`;
        }
      } else {
        return `Area-${idValue}`;
      }
    })();

    const sk = genSketch({
      feature: feat,
      name: featureName,
      ...feat.properties,
      ...sketchProperties,
      id: `${idValue}`,
    });
    sk.properties.userAttributes = [];
    return sk;
  });

  const sc = genSketchCollection(sketchFeatures, {
    name,
  });
  sc.properties.userAttributes = [];
};
