/**
 * Encapsulates an inversion of control container.
 */
export class IoCContainer {
  /**
   * A collection of services.
   *
   * @type {Map}
   */
  #services: Map<string, { definition: any; dependencies: string[]; singleton: boolean; type: boolean }>

  /**
   * A collection of single instances.
   *
   * @type {Map}
   */
  #singletons: Map<string, any>

  /**
   * Initializes a new instance.
   */
  constructor() {
    this.#services = new Map()
    this.#singletons = new Map()
  }

  /**
   * Registers a service with the container.
   */
  register(name: string, definition: any, { dependencies = [], singleton = false, type = false }: { dependencies?: string[], singleton?: boolean, type?: boolean } = {}): void {
    this.#services.set(
      name,
      {
        definition,
        dependencies,
        singleton: !!singleton,
        type: !!type
      })
  }
  /**
   * Resolves a value or object by name.
   *
   * @param {string} name - The service's name to resolve.
   * @returns {*} A service.
   */
  resolve(name: string): any {
    const service = this.#services.get(name)

    if (!service) {
      throw new Error(`Service '${name}' not found.`)
    }

    // Return the value.
    if (typeof service.definition !== 'function' || service.type) {
      return service.definition
    }

    // If not a singleton, create and return a new instance.
    if (!service.singleton) {
      return this.#createInstance(service)
    }

    // It's a singleton, so if it's necessary, create new instance,
    // and return the one and only instance.
    if (!this.#singletons.has(name)) {
      const instance = this.#createInstance(service)
      this.#singletons.set(name, instance)
    }

    return this.#singletons.get(name)
  }

  /**
   * Creates a new instance based on a service.
   *
   * @param {object} service - The service object, containing its definition and dependencies.
   * @returns {*} A new instance.
   */
  #createInstance(service: { definition: any; dependencies: string[] }): any {
    const args = service.dependencies?.map((dependency) => this.resolve(dependency)) || []
    return new service.definition(...args)
  }
}
