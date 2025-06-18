import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// eslint-disable-next-line no-unused-vars
const eslintConfig = [
  // ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
