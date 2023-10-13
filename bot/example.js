import {execSync, spawn} from "child_process";
import writeLog from "./src/logger";

const downloadProcess = spawn('dir', [], {
    shell: true,
    cwd: process.cwd(),
    env: process.env,
    stdio: 'pipe',
    encoding: 'utf-8'
});
downloadProcess.stderr.on('data', (data) => {
    console.log(`stderr: \n${data}`);

});
downloadProcess.stdout.on('data', (data) => {
    console.log(`child stdout: \n${data}`);
    writeLog(`${data}`);
});


const res = execSync('dir', {stdio: ['ignore', process.stdout, 'ignore']});
console.log(res.toString());
console.log('end')
// console.log(response.output);
console.log(`==============================`)
