import { Router, type IRouter } from "express";
import healthRouter from "./health";
import competitionsRouter from "./competitions";
import drawsRouter from "./draws";
import storageRouter from "./storage";
import accountRouter from "./account";

const router: IRouter = Router();

router.use(healthRouter);
router.use(accountRouter);
router.use(competitionsRouter);
router.use(drawsRouter);
router.use(storageRouter);

export default router;
