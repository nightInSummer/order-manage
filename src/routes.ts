import * as Stock from './controller/Stock'

/**
 * All application routes.
 */
export const AppRoutes = [
  {
    path: '/stock',
    method: 'get',
    action: Stock.getStockInfo
  },
  {
    path: '/stock',
    method: 'post',
    action: Stock.setStockInfo
  }
]
