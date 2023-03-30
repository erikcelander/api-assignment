import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose'



export class MongooseRepositoryBase<T extends Document> {
  #model: Model<T>
  #allowedModelPropertyNames: readonly string[] = []

  constructor(model: Model<T>) {
    this.#model = model
  }


  get model(): Model<T> {
    return this.#model
  }

  get allowedModelPropertyNames(): readonly string[] {
    if (!this.#allowedModelPropertyNames.length) {
      const disallowedPropertyNames = ['_id', '__v', 'createdAt', 'updatedAt', 'id']
      this.#allowedModelPropertyNames = Object.freeze(
        Object.keys(this.#model.schema.paths)
          .filter(key => !disallowedPropertyNames.includes(key))
      )
    }

    return this.#allowedModelPropertyNames
  }

  
  async get(filter: FilterQuery<T>, projection: any = null, options: QueryOptions = {}): Promise<T[]> {
    return this.#model
      .find(filter, projection, options)
      .exec()
  }

  async getById(id: string, projection: any = null, options: QueryOptions = {}): Promise<T | null> {
    return this.#model
      .findById(id, projection, options)
      .exec()
  }

  async getOne(conditions: FilterQuery<T>, projection: any = null, options: QueryOptions = {}): Promise<T | null> {
    return this.#model
      .findOne(conditions, projection, options)
      .exec()
  }

  async insert(insertData: Record<string, any>): Promise<T> {
    this.#ensureValidPropertyNames(insertData)

    return this.#model.create(insertData)
  }

  async delete(id: string, options: QueryOptions = {}): Promise<T | null> {
    return this.#model
      .findByIdAndDelete(id, options)
      .exec()
  }

  async update(id: string, updateData: UpdateQuery<T>, options: QueryOptions = {}): Promise<T | null> {
    this.#ensureValidPropertyNames(updateData)

    return this.#model
      .findByIdAndUpdate(id, updateData, {
        ...options,
        new: true,
        runValidators: true
      })
      .exec()
  }

  async replace(id: string, replaceData: Record<string, any>, options: QueryOptions = {}): Promise<T | null> {
    this.#ensureValidPropertyNames(replaceData)

    return this.#model
      .findOneAndReplace({ _id: id }, replaceData, {
        ...options,
        new: true,
        runValidators: true
      })
      .exec()
  }

  #ensureValidPropertyNames(data: Record<string, any>): void {
    for (const key of Object.keys(data)) {
      if (!this.allowedModelPropertyNames.includes(key)) {
        const error = new Error(`'${key} is not a valid property name.`)
        error.name = 'ValidationError'
        throw error
      }
    }
  }
}
