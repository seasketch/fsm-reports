/**
 * @jest-environment node
 * @group smoke
 */
import { clipToOceanEez } from "./clipToOceanEez";
import { clipToPolygonPreprocessorSmokeTest } from "../util/genClipToPolygonPreprocessorSmokeTest";

clipToPolygonPreprocessorSmokeTest(clipToOceanEez, "clipToOceanEez");
