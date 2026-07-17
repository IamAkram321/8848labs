import { Router } from "express";
import dashboardRouter from "./dashboard";
import ordersRouter from "./orders";
import customRequestsRouter from "./custom-requests";
import productsRouter from "./products";
import customersRouter from "./customers";
import collectionsRouter from "./collections";

const router = Router();

router.use(dashboardRouter);
router.use(ordersRouter);
router.use(customRequestsRouter);
router.use(productsRouter);
router.use(customersRouter);
router.use(collectionsRouter);

export default router;