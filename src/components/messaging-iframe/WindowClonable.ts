/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

export type WindowClonable =
  | null
  | string
  | number
  | boolean
  | Date
  | RegExp
  | ArrayBuffer
  | DataView
  | WindowTypedArray
  | Error
  | ClonableArray
  | WindowClonableMap
  | WindowClonableSet
  | WindowClonableObject;

export interface WindowClonableObject {
  [key: string]: WindowClonable;
}

export interface ClonableArray extends Array<WindowClonable> {}

export type WindowTypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

export interface WindowClonableMap
  extends Map<WindowClonable, WindowClonable> {}

export interface WindowClonableSet extends Set<WindowClonable> {}

export function toWindowClonable(obj: any): WindowClonable {
  if (obj === null) return null;

  switch (typeof obj) {
    case "string":
    case "number":
    case "boolean":
      return obj;
    case "object":
      if (Array.isArray(obj)) {
        return obj.map(toWindowClonable) as ClonableArray;
      }
      if (obj instanceof Date) return obj;
      if (obj instanceof RegExp) return obj;
      if (obj instanceof Error) return obj;
      if (obj instanceof ArrayBuffer) return obj;
      if (obj instanceof DataView) return obj;
      if (ArrayBuffer.isView(obj)) return obj as WindowTypedArray;

      const cleanObj: WindowClonableObject = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cleanObj[key] = toWindowClonable(obj[key]);
        }
      }
      return cleanObj;

    default:
      return null;
  }
}
