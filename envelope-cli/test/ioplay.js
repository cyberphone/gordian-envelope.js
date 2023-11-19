import fs from 'fs';
const args = process.argv.slice(2);


if (args.length == 0) {
  console.log("no params!");
}

let parm1 = args[0];
let parm2;
if (args.length == 2) {
  parm2 = args[1];
} else {
  parm2 = fs.readFileSync(process.stdin.fd, "utf-8");
}
console.log("parm1=" + parm1 + ", parm2=" + parm2);
