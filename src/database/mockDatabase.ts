import { getPool } from 'pgmock2';
import pgmock from 'pgmock2'

;

export const pg = new pgmock();
const mockPool = getPool(pg)



export default mockPool;