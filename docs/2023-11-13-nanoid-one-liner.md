# Generate nanoid one-liner

```
node --input-type=module -e "import { nanoid } from 'nanoid'; console.log(nanoid())"
```

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```