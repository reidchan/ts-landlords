declare namespace Array {
  interface ArrayConstructor {
    prototype: ArrayPrototype;
  }

  interface ArrayPrototype {
    remove(value: any): number;
  }
}