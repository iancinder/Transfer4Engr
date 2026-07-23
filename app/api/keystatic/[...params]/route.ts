import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

/** Handles the Keystatic GitHub App OAuth handshake and content commits. */
export const { POST, GET } = makeRouteHandler({ config });
