/**
 * 公共路径工具 — ESM 环境下获取 __dirname 和常用路径
 */

import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

/** 当前文件所在目录的 __dirname 等价物 */
export function getDirname(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}

/** 项目 src 目录 */
export function getSrcDir(importMetaUrl: string): string {
  return resolve(getDirname(importMetaUrl), "..");
}

/** 项目 data 目录 */
export function getDataDir(importMetaUrl: string): string {
  return resolve(getSrcDir(importMetaUrl), "data");
}

/** 项目 data/history 目录 */
export function getHistoryDir(importMetaUrl: string): string {
  return resolve(getDataDir(importMetaUrl), "history");
}
