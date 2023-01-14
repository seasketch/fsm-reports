import { FeatureCollection, Polygon } from "@seasketch/geoprocessing";
import fs from "fs-extra";
import { genSketch, genSketchCollection } from "../../src/util/sketch";

const usage =
  "Converts geojson polygon feature collection to sketch collection \n Usage: convertToSketch [INFILE] [OUTFILE] [NAME_PROPERTY]. \n INFILE expected to be polygon feature collection. \n NAME is optional feature property to assign sketch name from.  If not property by that name in feature then used as a name prefix [PREFIX]-1, [PREFIX-2], otherwise sketch names assigned as 'Area-1', 'Area-2'";

let infile = process.argv[2];
let outfile = process.argv[3];
let name = process.argv[4];
if (!infile || !outfile) {
  console.error(usage);
  process.exit();
}

const fc = fs.readJSONSync(infile) as FeatureCollection<Polygon>;
console.log(fc);

const sketchFeatures = fc.features.map((feat, idx) => {
  const featureName = (() => {
    if (name) {
      if (feat.properties && feat.properties[name]) {
        return feat.properties[name];
      } else {
        return `${name}-${idx + 1}`;
      }
    } else {
      return `Area-${idx}`;
    }
  })();
  console.log(`Feature name is ${featureName}`);
  const sk = genSketch(feat.geometry, {
    name: featureName,
  });
  delete sk.properties.userAttributes;
  return sk;
});

const sc = genSketchCollection(sketchFeatures, {
  name: "contiguous_zone_sketches",
});
delete sc.properties.userAttributes;

fs.removeSync(outfile);
fs.writeJSONSync(outfile, sc);
