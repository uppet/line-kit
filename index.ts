
interface LineFunction {
    (v: string): void
}

interface WrapFunction {
    (): void
}

// function LineKit(stream: NodeJS.ReadStream,
//                  eachFunc: LineFunction,
//                  finalFunc?: WrapFunction,
//                  preFunc?: WrapFunction) {
//     if (preFunc) { preFunc() }
//     let theLine = '';
//     let ended = false;
//     stream.on('readable', () => {
//         while(stream.readable && !ended) {
//             stream.read(0)
//             let nextChar = stream.read(1);
//             if (nextChar == '\n') {
//                 eachFunc(theLine);
//                 theLine = '';
//             } else if (nextChar == null) {
//                 console.log('NULL TSB.')
//                 ended = true;
//                 if (finalFunc) { finalFunc(); break; }
//                 break;
//             } else {
//                 theLine += nextChar;
//             }
//         }
//     });
// }

// use flow
function LineKit(stream: NodeJS.ReadStream,
                 eachFunc: LineFunction,
                 finalFunc?: WrapFunction,
                 preFunc?: WrapFunction) {
    if (preFunc) { preFunc() }
    let theLine = '';
    let ended = false;
    stream.on('data', (chunk) => {
        let chunkStr = chunk.toString();
        for(let idx = 0; idx < chunkStr.length; idx++) {
            let nextChar = chunkStr[idx];
            if (nextChar == '\n') {
                eachFunc(theLine);
                theLine = '';
            } else {
                theLine += nextChar;
            }
        }
    });
    stream.on('end', () => {
        if (finalFunc) { finalFunc();}
    });
}


module.exports = LineKit
if (module == require.main) {
    const fs = require('fs')
    if (process.argv.length != 3 || fs.exists(process.argv[2])) {
        
        process.exit(1);
    }
    let freqs = {}
    LineKit(
        fs.createReadStream(process.argv[2]),
        line => {
            if (line in freqs) {
                freqs[line]++;
            } else {
                freqs[line] = 1;
            }
        }, () => {
            let max = 0;
            let maxName = '';
            let min = -1;
            let minName = '';
            for (let name in freqs) {
                console.log(`${name} , ${freqs[name]}`);
                if (min == -1) {
                    min = freqs[name];
                    minName = name;
                }
                if (freqs[name] > max) {
                    max = freqs[name]
                    maxName = name;
                }
                if (freqs[name] < min) {
                    min = freqs[name]
                    minName = name;
                }
            }

            console.log(`\n?? TOTAL UNIQ:${Object.keys(freqs).length}`);
            console.log(`\n?^ MAX ${maxName}:${freqs[maxName]}`);
            console.log(`\n?^ MIN ${minName}:${freqs[minName]}`);
            console.log('DONE.')
        }
    );
}
