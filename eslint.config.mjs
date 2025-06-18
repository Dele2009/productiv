import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// resolve directory first
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// create FlatCompat instance
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  // reuse existing config
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // then override or add custom rules
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

// export final config
export default eslintConfig;
