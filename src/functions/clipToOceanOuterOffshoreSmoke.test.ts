/**
 * @jest-environment node
 * @group smoke
 */
import { clipToOuterOffshore } from "./clipToOceanOuterOffshore";
import { clipToPolygonPreprocessorSmokeTest } from "../util/genClipToPolygonPreprocessorSmokeTest";

clipToPolygonPreprocessorSmokeTest(
  clipToOuterOffshore,
  "clipToOceanOuterOffshore"
);
