const scheme = "http";
// const scheme = "https";

// const host = "localhost:9973";
const host = "192.168.1.5:9973";

const origin = `${scheme}://${host}`;

export default {
  api: {
    scheme,
    host,
    origin,
  },
};
