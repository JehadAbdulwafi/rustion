const scheme = "http";
// const scheme = "https";
const APP_ID = "1172c65a-b76c-445c-ad7e-a75c79ba1743";

// const host = "localhost:9973";
const host = "192.168.1.8:9973";

const origin = `${scheme}://${host}`;

export default {
  api: {
    scheme,
    host,
    origin,
  },
  app: {
    id: APP_ID,
    name: {
      ar: "اسم التطبيق",
      en: "App Name",
    },
  }
};
