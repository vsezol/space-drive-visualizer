export class SizedMap<K, T> {
  private readonly objectById: Map<K, T[]> = new Map([]);

  constructor(private readonly size: number) {}

  get(id: K): T[] {
    return this.objectById.get(id) ?? [];
  }

  add(id: K, object: T): void {
    this.objectById.set(id, [...this.get(id), object].slice(-this.size));
  }
}
