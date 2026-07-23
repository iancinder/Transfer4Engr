"use client";

import { makePage } from "@keystatic/next/ui/app";
import config from "../../../keystatic.config";

/** The Keystatic admin UI, mounted at /keystatic. Excluded in robots.ts. */
export default makePage(config);
