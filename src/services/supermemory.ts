import { NodeHttpClient } from "@effect/platform-node";
import { Layer } from "effect";
import {
  ConnectionsService,
  MemoriesService,
  SearchService,
  SettingsService,
  SupermemoryConfigFromEnv,
  SupermemoryHttpClientService,
} from "effect-supermemory";

// Create the full service layer
const platformHttpLayer = NodeHttpClient.layer;
const baseLayer = Layer.merge(SupermemoryConfigFromEnv, platformHttpLayer);
const httpClientLayer = Layer.provide(
  SupermemoryHttpClientService.Default,
  baseLayer
);

export const SupermemoryLayer = Layer.mergeAll(
  Layer.provide(MemoriesService.Default, httpClientLayer),
  Layer.provide(SearchService.Default, httpClientLayer),
  Layer.provide(ConnectionsService.Default, httpClientLayer),
  Layer.provide(SettingsService.Default, httpClientLayer)
);
