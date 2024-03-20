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

import { moaEnv } from "@/moaEnv";
import { Configuration } from "myorderapp-square";
import { Session } from "next-auth";

export function configurationForSession(
  session: Session | null
): Configuration {
  return new Configuration({
    accessToken: session?.user.token,
    apiKey: moaEnv.backendApiKey,
    basePath: moaEnv.backendUrl,
  });
}
