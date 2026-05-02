import { getAuth, Auth } from "firebase/auth";
import app from "./firebase";

const auth: Auth = getAuth(app);

export { auth };
