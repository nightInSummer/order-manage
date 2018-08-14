import * as Stock from './controller/Stock'
import * as Machining from './controller/Machining'
import * as Level from './controller/Level'
import * as Chill from './controller/Chill'
import * as Storage from './controller/Storage'
import * as Packing from './controller/Packing'
import * as Wastage from './controller/Wastage'

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
  },
  {
    path: '/stock',
    method: 'delete',
    action: Stock.deleteStockInfo
  },
  {
    path: '/machining',
    method: 'get',
    action: Machining.getMachiningInfo
  },
  {
    path: '/machining',
    method: 'post',
    action: Machining.setMachiningInfo
  },
  {
    path: '/machining',
    method: 'delete',
    action: Machining.deleteMachiningInfo
  },
  {
    path: '/level',
    method: 'get',
    action: Level.getLevelInfo
  },
  {
    path: '/level',
    method: 'post',
    action: Level.setLevelInfo
  },
  {
    path: '/level',
    method: 'delete',
    action: Level.deleteLevelInfo
  },
  {
    path: '/chill',
    method: 'get',
    action: Chill.getChillInfo
  },
  {
    path: '/chill',
    method: 'put',
    action: Chill.updateChillInfo
  },
  {
    path: '/storage',
    method: 'get',
    action: Storage.getStorageInfo
  },
  {
    path: '/storage',
    method: 'put',
    action: Storage.updateStorageInfo
  },
  {
    path: '/customer',
    method: 'get',
    action: Stock.getCustomer
  },
  {
    path: '/customer',
    method: 'delete',
    action: Stock.deleteCustomer
  },
  {
    path: '/packing',
    method: 'get',
    action: Packing.getPackingInfo
  },
  {
    path: '/packing',
    method: 'post',
    action: Packing.savePackingInfo
  },
  {
    path: '/packing',
    method: 'delete',
    action: Packing.deletePackingInfo
  },
  {
    path: '/wastage',
    method: 'get',
    action: Wastage.getWastageInfo
  },
  {
    path: '/wastage',
    method: 'post',
    action: Wastage.saveWastageInfo
  },
  {
    path: '/wastage',
    method: 'delete',
    action: Wastage.deleteWastageInfo
  }
]
