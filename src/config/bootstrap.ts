/**
 * Module for bootstrapping.
 *
 * @author Mats Loock
 * @version 2.0.0
 */

import { IoCContainer } from '../util/IoCContainer'
import dotenv from 'dotenv'

dotenv.config()
const iocContainer = new IoCContainer()

iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)

// iocContainer.register('TaskModelType', TaskModel, { type: true })

// iocContainer.register('TaskRepositorySingleton', TaskRepository, {
//   dependencies: [
//     'TaskModelType'
//   ],
//   singleton: true
// })

// iocContainer.register('TasksServiceSingleton', TasksService, {
//   dependencies: [
//     'TaskRepositorySingleton'
//   ],
//   singleton: true
// })

// iocContainer.register('TasksController', TasksController, {
//   dependencies: [
//     'TasksServiceSingleton'
//   ]
// })

export const container = Object.freeze(iocContainer)
