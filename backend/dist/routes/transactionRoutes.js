"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', transactionController_1.getTransactions);
router.get('/dashboard', transactionController_1.getDashboardMetrics);
router.get('/filters', transactionController_1.getFilterOptions);
router.post('/export/csv', transactionController_1.exportCSV);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map