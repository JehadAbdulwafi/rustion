/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: [
    "en",
    "ar",
  ],
  catalogs: [
    {
      path: "<rootDir>/i18n/locales/{locale}/messages",
      include: ["<rootDir>"],
      exclude: ["**/node_modules/**", "**/__tests__/**"],
    },
  ],
  format: "po",
};
