// process.env.REMAX_PLATFORM = 'wechat';
// // process.env.NODE_ENV = 'production';

// const {
//     buildApp
// } = require('remax/build');
// const express = require('express');
// const middleware = require('webpack-dev-middleware/lib/middleware');
// const app = express();
// const config = require("../remax.config.js");
// const port = 3000;

// const compiler = buildApp({
//     target: 'wechat',
//     minimize: true,
//     watch: true,
//     ...config,
//     port
// });

// function wrap(compiler, options) {
//     const context = {
//         compiler,
//         ...options
//     }

//     function done(stats) {
//         // We are now on valid state
//         context.state = true;
//         context.webpackStats = stats;

//         // Do the stuff in nextTick, because bundle may be invalidated
//         // if a change happened while compiling
//         process.nextTick(() => {
//             // check if still in valid state
//             if (!context.state) {
//                 return;
//             }

//             // execute callback that are delayed
//             const cbs = context.callbacks;
//             context.callbacks = [];
//             cbs.forEach((cb) => {
//                 cb(stats);
//             });
//         });
//     }

//     compiler.hooks.done.tap('WebpackDevMiddleware', done);
//     return context;
// }

// app.use(
//     middleware(wrap(compiler, {
//         log: console,
//         callbacks: [],
//         options: {
//             // webpack-dev-middleware options
//             stats: false
//         }
//     }))
// );

// app.listen(port, () => console.log('Example app listening on port 3000!'));
