/**
 * @jest-environment node
 * @group smoke
 */
import { clipToNearshore } from "./clipToOceanNearshore";
import {
  getExamplePolygonSketches,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { ValidationError } from "@seasketch/geoprocessing";
import booleanValid from "@turf/boolean-valid";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof clipToNearshore).toBe("function");
  });

  test("clipToNearshore", async () => {
    const examples = await getExamplePolygonSketches();
    console.log(examples);
    console.log(examples.length);
    for (const example of examples) {
      try {
        const result = await clipToNearshore(example);
        expect(result).toBeTruthy();
        expect(booleanValid(result));
        expect(
          result.geometry.type === "Polygon" ||
            result.geometry.type === "MultiPolygon"
        );
        writeResultOutput(result, "clipToNearshore", example?.properties?.name);
      } catch (e) {
        console.log("error", example?.properties?.name, e);
        if (e instanceof ValidationError) {
          // ValidationErrors don't indicate failures, just comprehensive tests
        } else {
          throw e;
        }
      }
    }
  }, 20000);
});
