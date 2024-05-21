# POW-captcha-js

A pow-based captcha for your web application.

## require

- nodejs >= v14.15.0

## How to use

```shell
npm install
```

```
npm run build
```

Then you will find `pow-captcha-js.js` in `./dist`.

Copy it to your project.

For example in vue,you can copy it to `static\js\pow-captcha-js.js`,

then use it with code:

```vue
<script>
    import { Captcha } from "../../static/js/pow-captcha-js.js"
	export default {
      mounted() {
        this.pow();
      },
      methods: {
      	pow() {
		  const CONFIG_URL = '/api/admin/powConfig';
          const VERIFY_URL = '/api/admin/powVerify'
          const cpt = new Captcha();
          cpt.start(CONFIG_URL, VERIFY_URL).then(resobj=>{
            console.log('obj==>', resobj);
          }).catch(e=>{
            console.log('pow e =>', e);
          })
    	},
      }
  },
</script>
```

⚡You must design the server logic for the pow

## API

### server

#### 1.

In server,You must return json data in `CONFIG_URL`

The format of return data may be like this:

```json
{"difficulty":5,"prefix":"Ve03Plle"}
```

where `difficulty`indicates the difficulty of the pow puzzle and `prefix`indicates the random string.

The thing of client must to do is that find a `paddingNum`,which satisfies:

```
md5(prefix+string(paddingNum))=000...00xxxx
```

where the number of leading zeros at least `difficulty`

#### 2.

 In `VERIFY_URL`，you will get the data posted by client, where data likes:

```json
{
    "data":{
        "md5Str":"00000119414c7a8c9678b96fbc4954be",
        "paddingNum":300880
    }
}
```

You must verify two things:

1. `md5Str==md5(prefix+paddingNum)`
2. The leading zeros of  `md5Str`must at least `difficulty`

`difficulty` and `prefix` correspond to the value you gave the client earlier.

### client

`Captcha.start()`will return a object if pow-process is success.

```js
{
    verify: true, 
    totalTryCnt: totalTryCnt
}
```

|    field    |                description                |
| :---------: | :---------------------------------------: |
|   verify    |        The result of server verify        |
| totalTryCnt | The total times of try to find paddingNum |

