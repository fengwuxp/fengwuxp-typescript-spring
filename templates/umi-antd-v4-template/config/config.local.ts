import config from "./config";
import {IConfig} from "umi-types";

console.log("use local file");

export default {
  ...config,
  define: {
    "process.env.API_ADDRESS": "http://localhost:8090/api",
  },
} as IConfig
