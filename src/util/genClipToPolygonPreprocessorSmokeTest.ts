import {
  getExamplePolygonSketches,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { Feature, ValidationError } from "@seasketch/geoprocessing";
import booleanValid from "@turf/boolean-valid";

export const clipToPolygonPreprocessorSmokeTest = (
  preprocessorFunc: (feature: Feature) => Promise<Feature>,
  preprocessorName: string,
  options: {
    testName?: string | undefined;
  } = {}
) => {
  const { testName = undefined } = options;

  describe("Basic smoke tests", () => {
    test("handler function is present", () => {
      expect(typeof preprocessorFunc).toBe("function");
    });

    test(`${preprocessorName}Smoke`, async () => {
      const examples = await getExamplePolygonSketches(testName);
      for (const example of examples) {
        try {
          const result = await preprocessorFunc(example);
          expect(result).toBeTruthy();
          expect(booleanValid(result));
          expect(
            result.geometry.type === "Polygon" ||
              result.geometry.type === "MultiPolygon"
          );
          writeResultOutput(
            result,
            preprocessorName,
            example?.properties?.name
          );
        } catch (e) {
          console.log("error", example?.properties?.name, e);
          if (e instanceof ValidationError) {
            // ValidationErrors don't indicate failures, just comprehensive tests
          } else {
            throw e;
          }
        }
      }
    }, 60000);
  });
};
