import { MongooseRepositoryBase } from '../repositories/MongooseRepositoryBase'
import { Document } from 'mongoose'

export class MongooseServiceBase<T extends Document<any, any, any>> {
  protected _repository: MongooseRepositoryBase<T>

  constructor(repository: MongooseRepositoryBase<T>) {
    this._repository = repository
  }

  async get(filter?: any, projection?: any, options?: any): Promise<T[]> {
    return this._repository.get(filter, projection, options)
  }

  async getById(id: string, projection?: any, options?: any): Promise<T | null> {
    return this._repository.getById(id, projection, options)
  }

  async getOne(conditions: any, projection?: any, options?: any): Promise<T | null> {
    return this._repository.getOne(conditions, projection, options)
  }

  async insert(data: T): Promise<T> {
    return this._repository.insert(data)
  }

  async update(id: string, updateData: Partial<T>, options?: any): Promise<T | null> {
    return this._repository.update(id, updateData, options)
  }

  async replace(id: string, replaceData: T, options?: any): Promise<T | null> {
    return this._repository.replace(id, replaceData, options)
  }

  async delete(id: string, options?: any): Promise<T | null> {
    return this._repository.delete(id, options)
  }
}
