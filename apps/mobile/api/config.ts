// const scheme = "http";
const scheme = "https";
const APP_ID = "0b65317c-7648-4dce-9e43-a86852a6bf03";

const host = "server.jehad.ly";
// const host = "192.168.1.2:9973";

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
