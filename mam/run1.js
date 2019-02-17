const mamStateCreate = require('./mamStateCreate')
const publish = require('./publish')

let _mamState = mamStateCreate();
let nextRoot = null;

function run() {
    _mamState.then(async mamState => {
        var t = new Date()
        const res = await publish(
            mamState,
            {
                d: t.toLocaleTimeString(),
                hello: 'world'
            },
        );
        //const nextRoot = res.mamState.channel.next_root;
        nextRoot = res.root;
        _mamState = Promise.resolve(res.mamState);
    }).catch(err => console.dir(err))
}

run();
run();
run();