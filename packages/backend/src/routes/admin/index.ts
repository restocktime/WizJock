import { Router } from 'express';
import reportsRouter from './reports';
import injuriesRouter from './injuries';
import intelligenceRouter from './intelligence';
import lineMovementsRouter from './lineMovements';
import picksRouter from './picks';
import playerPropsRouter from './playerProps';
import performanceRouter from './performance';

const router = Router();

// Mount all admin routes
router.use('/reports', reportsRouter);
router.use('/injuries', injuriesRouter);
router.use('/intelligence', intelligenceRouter);
router.use('/line-movements', lineMovementsRouter);
router.use('/picks', picksRouter);
router.use('/player-props', playerPropsRouter);
router.use('/performance', performanceRouter);

export default router;
