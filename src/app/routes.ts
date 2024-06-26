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

export const routes = {
  index: "/",
  login: "/login",
  register: "/register",
  resetPassword: {
    index: "/reset-password",
    confirm: "/reset-password/confirm",
  },
  dashboard: "/dashboard",
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  account: "/account",
  theme: "/theme",
  catalog: "/catalog",
  customers: "/customers",
  locations: "/locations",
  orders: "/orders",
  support: "/support",
  licenses: "/licenses",
  setup: {
    index: "/setup",
    theme: "/setup/theme",
    catalog: "/setup/catalog",
    square: {
      index: "/setup/square",
      sync: "/setup/square/sync",
    },
    plan: "/setup/plan",
    cancel: "/setup/cancel",
    pro: {
      complete: "/setup/pro/complete",
    },
    starter: {
      complete: "/setup/starter/complete",
    },
    free: {
      complete: "/setup/free/complete",
    },
  },
};
