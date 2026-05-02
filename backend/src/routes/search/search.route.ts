import { Router } from "express";
import { auth } from "../../middleware/auth/auth.middleware";
import { searchResources } from "../../controller/search/search.controller";

const router = Router();

router.route("/").get(auth, searchResources);

export default router;
