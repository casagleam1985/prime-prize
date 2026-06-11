import { Router, type IRouter } from "express";
import healthRouter from "./health";
import competitionsRouter from "./competitions";
import drawsRouter from "./draws";

const router: IRouter = Router();

router.use(healthRouter);
router.use(competitionsRouter);
router.use(drawsRouter);

export default router;
