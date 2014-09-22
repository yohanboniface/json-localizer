# localize-json
When you need humans to localize a json object from a
config file. Typical use case if for a local config file to extand
an application config on the fly.

## Example

```
var Localizer = require('localize-json').Localizer;
var localizer = new Localizer(myobj);
localizer.where('path.to.prop').if({'prop': 'hasvalue'}.then({'addthis': 'propandvalue'}));
// `if` is optional
localizer.where('simpleprop').then('setthisvalue');
```

## API

### .where(rules)

`rules`: path to an object; eg.: `prop`, `nested.prop`.

Define which object(s) to target.

### .if(rules)

`rules`: object of rules to filter the targetted objects.
Eg.: `{'thisprop': 'hasthisvalue'}

Can be a single flat value instead of an object, and then the targetted
key will be checked against this value.

### .then(rules)

`rules`: object of rules to apply on the filtered objects.
Eg.: `{sethis: 'propandvalue', {anotherprop: 'tobeset'}}`

Can be a single flat value instead of an object, and then the targetted key
will be replaced by this value.


See [tests](https://github.com/yohanboniface/json-localizer/blob/master/tests/index.js) for more examples.
