/**
 * @jest-environment node
 * @group smoke
 */
import handler from "./normaCatchValueOverlap";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof handler.func).toBe("function");
  });
  test("normaCatchValueOverlapSmoke - tests run against all examples", async () => {
    // data fetch fails if run all sketches, too many requests?
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await handler.func(example);
      expect(result).toBeTruthy();
      writeResultOutput(
        result,
        "normaCatchValueOverlap",
        example.properties.name
      );
    }
  }, 60000);
});
