export default class ArrayUtils {

  public static remove(arr: any[], val: any): number {
    const index: number = arr.indexOf(val);
    if (index !== -1) {
      arr.splice(index, 1);
    }
    return index;
  }

}
