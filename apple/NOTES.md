# Keys

## Prod

AuthKey_Prod_BQU947F448.p8 / BQU947F448

```
node apple-gen-secret.mjs \
--key_id BQU947F448 \
--team_id 24TXZ384X3 \
--private_key "$(cat AuthKey_Prod_BQU947F448.p8)" \
--client_id dev.myorderapp.buyers
```

## Dev

AuthKey_Dev_M86WL4J8YV.p8 / M86WL4J8YV

```
node apple-gen-secret.mjs \
--key_id M86WL4J8YV \
--team_id 24TXZ384X3 \
--private_key "$(cat AuthKey_Dev_M86WL4J8YV.p8)" \
--client_id dev.myorderapp.buyers
```

# Log

## Fri 27 Oct 2023 03:00:07 PM EDT

```
node apple-gen-secret.mjs \
--key_id BQU947F448 \
--team_id 24TXZ384X3 \
--private_key "$(cat AuthKey_Prod_BQU947F448.p8)" \
--client_id dev.myorderapp.buyers
```

- Apple client secret generated.
- Valid until: Wed Apr 24 2024 15:00:04 GMT-0400 (Eastern Daylight Time)

```
eyJhbGciOiJFUzI1NiIsImtpZCI6IkJRVTk0N0Y0NDgifQ.eyJhdWQiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiaXNzIjoiMjRUWFozODRYMyIsImlhdCI6MTY5ODQzMzIwMywiZXhwIjoxNzEzOTg1MjA0LCJzdWIiOiJkZXYubXlvcmRlcmFwcC5idXllcnMifQ.cQNzpKVPHWVaQZFBx13OPvUJuUO87MMqHludWoGqE7x3yNliEXu1sATLDLrjo7UKfeSJNGKQlgeRQbjxBWiukw
```

## Fri 20 Oct 2023 12:19:26 AM EDT

node apple-gen-secret.mjs \
--key_id M86WL4J8YV \
--team_id 24TXZ384X3 \
--private_key "$(cat AuthKey_Dev_M86WL4J8YV.p8)" \
--client_id dev.myorderapp.buyers

- Apple client secret generated.
- Valid until: Wed Apr 17 2024 00:19:11 GMT-0400 (Eastern Daylight Time)

```
eyJhbGciOiJFUzI1NiIsImtpZCI6Ik04NldMNEo4WVYifQ.eyJhdWQiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiaXNzIjoiMjRUWFozODRYMyIsImlhdCI6MTY5Nzc3NTU1MCwiZXhwIjoxNzEzMzI3NTUxLCJzdWIiOiJkZXYubXlvcmRlcmFwcC5idXllcnMifQ.iccVHZKBfHlwmZsedDsGQPZYkeXa64qGtNfeZLlLWTcuAC5aM12_E_J3MXTpXDigUNFd7ettODZ-rZLMFJgZjA
```

# Some time before

com.myorderapp.sellers valid until: Mon Apr 15 2024 20:51:22 GMT-0400 (Eastern Daylight Time)
