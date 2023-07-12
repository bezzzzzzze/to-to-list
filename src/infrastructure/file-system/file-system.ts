import { promises as fs } from "node:fs";
import { normalize } from "node:path";

export class FileSystem {
  public static async read<T>(path: string): Promise<T> {
    const _path = FileSystem.normalize(path);
    try {
      const data = await fs.readFile(_path);
      return JSON.parse(data.toString()) as T;
    } catch (error) {
      throw new Error(`File not found: path - ${_path}`);
    }
  }

  public static async write<T>(data: T, path: string): Promise<void> {
    const _path = FileSystem.normalize(path);
    try {
      await fs.writeFile(_path, JSON.stringify(data, null, 1));
    } catch (error) {
      throw error;
    }
  }

  private static normalize(path: string): string {
    if (path.split("")[0] === "/") {
      return normalize(path);
    }
    return normalize(`${__dirname}/../${path}`);
  }
}
