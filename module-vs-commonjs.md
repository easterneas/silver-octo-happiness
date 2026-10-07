```js
// type --> module
// import package
// 1 - import syntax
import {} from '@nama/package';
import Package from '@nama/package';

// 2 - import() -- asynchronous
const PackageLewatImport = import('@nama/package'); // Promise

// export
export {

};
export default Variable; // sama kayak `module.exports = Variable;` di CommonJS

// type --> commonjs
// import
const PackageLewatCommonJS = require('@nama/package'); // synchronous

// export
module.exports = Variable; // sama kayak `export default Variable;`
```