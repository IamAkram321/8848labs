import { Router } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import collectionsRouter from "./collections";
import categoriesRouter from "./categories";
import projectsRouter from "./projects";
import journalRouter from "./journal";
import customOrdersRouter from "./custom-orders";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import uploadsRouter from "./uploads";
import testimonialsRouter from "./testimonials";
import statsRouter from "./stats";
import authRouter from "./auth";
import adminRouter from "./admin";

const router = Router();

router.use(healthRouter);
router.use(authRouter);
router.use("/admin", adminRouter);
router.use(productsRouter);
router.use(collectionsRouter);
router.use(categoriesRouter);
router.use(projectsRouter);
router.use(journalRouter);
router.use(customOrdersRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(uploadsRouter);
router.use(testimonialsRouter);
router.use(statsRouter);

export default router;