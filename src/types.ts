export interface Env {
  STORE_BUCKET: R2Bucket;
  STORE_KV: KVNamespace;
  GITHUB_TOKEN?: string;
  REFRESH_TOKEN?: string;
}
