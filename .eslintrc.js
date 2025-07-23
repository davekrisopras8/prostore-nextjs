module.exports = {
  // ...config global Anda
  ignorePatterns: ["lib/generated/prisma/", ".next/"],
  overrides: [
    {
      files: ["lib/generated/prisma/**/*.js", "lib/generated/prisma/**/*.ts"],
      rules: {
        // matikan rule‐rule yang menimbulkan error di sana
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-this-alias": "off",
        // matikan semua eslint di file generated
        "no-unused-expressions": "off",
      },
    },
  ],
};
