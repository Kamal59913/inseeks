import { config as dotenvConfig } from "dotenv";

dotenvConfig({
    path:''
});
class Config {


static getENVVariable(value: string) {
    process.env[value];
  }
}
export default new Config();
