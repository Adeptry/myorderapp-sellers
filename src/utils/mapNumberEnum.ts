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

export function mapNumberEnum<T extends Record<string | number, unknown>, U>(
  enumerable: T,
  fn: (v: number) => U
): U[] {
  return Object.values(enumerable)
    .filter(Number.isInteger)
    .map((value) => fn(value as unknown as number)); // we are sure the value is a number because of the filter
}
