import type { CredentialsConfig } from "next-auth";

declare function CredentialsProvider(config: CredentialsConfig): unknown;

export default CredentialsProvider;
