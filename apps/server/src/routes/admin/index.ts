import { Router } from "express";
import dashboardRouter from "./dashboard";
import ordersRouter from "./orders";
import customRequestsRouter from "./custom-requests";
import productsRouter from "./products";
import customersRouter from "./customers";
import collectionsRouter from "./collections";
import reviewsRouter from "./reviews";

const router = Router();

router.use(dashboardRouter);
router.use(ordersRouter);
router.use(customRequestsRouter);
router.use(productsRouter);
router.use(customersRouter);
router.use(collectionsRouter);
router.use(reviewsRouter);

export default router;