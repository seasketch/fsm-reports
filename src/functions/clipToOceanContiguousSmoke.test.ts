/**
 * @jest-environment node
 * @group smoke
 */
import { clipToContiguous } from "./clipToOceanContiguous";
import { clipToPolygonPreprocessorSmokeTest } from "../util/genClipToPolygonPreprocessorSmokeTest";

clipToPolygonPreprocessorSmokeTest(clipToContiguous, "clipToOceanContiguous");
