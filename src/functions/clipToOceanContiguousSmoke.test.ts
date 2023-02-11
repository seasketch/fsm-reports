/**
 * @jest-environment node
 * @group smoke
 */
import handler, { clipToContiguous } from "./clipToOceanContiguous";
import { polygonPreprocessorSmokeTest } from "@seasketch/geoprocessing/scripts/testing";

polygonPreprocessorSmokeTest(clipToContiguous, handler.options.title, {
  timeout: 20000,
});
