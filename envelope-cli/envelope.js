// Gordian Envelope CLI
import CBOR from 'cbor-object';

const ENVELOPE_TAG = 200n;
const SUBJECT_TAG = 24n;
const URI_TAG = 32n;

const ENVELOPE_UR = "ur:envelope/";

const TO_BYTEWORDS = [
  'ae', 'ad', 'ao', 'ax', 'aa', 'ah', 'am', 'at', 'ay', 'as', 'bk', 'bd', 'bn', 'bt', 'ba', 'bs',
  'be', 'by', 'bg', 'bw', 'bb', 'bz', 'cm', 'ch', 'cs', 'cf', 'cy', 'cw', 'ce', 'ca', 'ck', 'ct',
  'cx', 'cl', 'cp', 'cn', 'dk', 'da', 'ds', 'di', 'de', 'dt', 'dr', 'dn', 'dw', 'dp', 'dm', 'dl',
  'dy', 'eh', 'ey', 'eo', 'ee', 'ec', 'en', 'em', 'et', 'es', 'ft', 'fr', 'fn', 'fs', 'fm', 'fh',
  'fz', 'fp', 'fw', 'fx', 'fy', 'fe', 'fg', 'fl', 'fd', 'ga', 'ge', 'gr', 'gs', 'gt', 'gl', 'gw',
  'gd', 'gy', 'gm', 'gu', 'gh', 'go', 'hf', 'hg', 'hd', 'hk', 'ht', 'hp', 'hh', 'hl', 'hy', 'he',
  'hn', 'hs', 'id', 'ia', 'ie', 'ih', 'iy', 'io', 'is', 'in', 'im', 'je', 'jz', 'jn', 'jt', 'jl',
  'jo', 'js', 'jp', 'jk', 'jy', 'kp', 'ko', 'kt', 'ks', 'kk', 'kn', 'kg', 'ke', 'ki', 'kb', 'lb',
  'la', 'ly', 'lf', 'ls', 'lr', 'lp', 'ln', 'lt', 'lo', 'ld', 'le', 'lu', 'lk', 'lg', 'mn', 'my',
  'mh', 'me', 'mo', 'mu', 'mw', 'md', 'mt', 'ms', 'mk', 'nl', 'ny', 'nd', 'ns', 'nt', 'nn', 'ne',
  'nb', 'oy', 'oe', 'ot', 'ox', 'on', 'ol', 'os', 'pd', 'pt', 'pk', 'py', 'ps', 'pm', 'pl', 'pe',
  'pf', 'pa', 'pr', 'qd', 'qz', 're', 'rp', 'rl', 'ro', 'rh', 'rd', 'rk', 'rf', 'ry', 'rn', 'rs',
  'rt', 'se', 'sa', 'sr', 'ss', 'sk', 'sw', 'st', 'sp', 'so', 'sg', 'sb', 'sf', 'sn', 'to', 'tk',
  'ti', 'tt', 'td', 'te', 'ty', 'tl', 'tb', 'ts', 'tp', 'ta', 'tn', 'uy', 'uo', 'ut', 'ue', 'ur',
  'vt', 'vy', 'vo', 'vl', 've', 'vw', 'va', 'vd', 'vs', 'wl', 'wd', 'wm', 'wp', 'we', 'wy', 'ws',
  'wt', 'wn', 'wz', 'wf', 'wk', 'yk', 'yn', 'yl', 'ya', 'yt', 'zs', 'zo', 'zt', 'zc', 'ze', 'zm'];

const FROM_BYTEWORDS = [
  0x04,   -1,   -1, 0x01, 0x00,   -1,   -1, 0x05,   -1,   -1,   -1,   -1, 0x06,   -1, 0x02,   -1,
    -1,   -1, 0x09, 0x07,   -1,   -1,   -1, 0x03, 0x08,   -1, 0x0e, 0x14,   -1, 0x0b, 0x10,   -1,
  0x12,   -1,   -1,   -1, 0x0a,   -1,   -1, 0x0c,   -1,   -1,   -1,   -1, 0x0f, 0x0d,   -1,   -1,
  0x13,   -1, 0x11, 0x15, 0x1d,   -1,   -1,   -1, 0x1c, 0x19,   -1, 0x17,   -1,   -1, 0x1e, 0x21,
  0x16, 0x23,   -1, 0x22,   -1,   -1, 0x18, 0x1f,   -1,   -1, 0x1b, 0x20, 0x1a,   -1, 0x25,   -1,
    -1,   -1, 0x28,   -1,   -1,   -1, 0x27,   -1, 0x24, 0x2f, 0x2e, 0x2b,   -1, 0x2d,   -1, 0x2a,
  0x26, 0x29,   -1,   -1, 0x2c,   -1, 0x30,   -1,   -1,   -1, 0x35,   -1, 0x34,   -1,   -1, 0x31,
    -1,   -1,   -1,   -1, 0x37, 0x36, 0x33,   -1,   -1,   -1, 0x39, 0x38,   -1,   -1,   -1,   -1,
  0x32,   -1,   -1,   -1,   -1, 0x48, 0x45,   -1, 0x46, 0x3f,   -1,   -1,   -1, 0x47, 0x3e, 0x3c,
    -1, 0x41,   -1, 0x3b, 0x3d, 0x3a,   -1,   -1, 0x42, 0x43, 0x44, 0x40, 0x49,   -1,   -1, 0x50,
  0x4a,   -1,   -1, 0x54,   -1,   -1,   -1, 0x4e, 0x52,   -1, 0x55,   -1,   -1, 0x4b, 0x4c, 0x4d,
  0x53,   -1, 0x4f,   -1, 0x51,   -1,   -1,   -1,   -1, 0x58, 0x5f, 0x56, 0x57, 0x5c,   -1,   -1,
  0x59, 0x5d,   -1, 0x60,   -1, 0x5b,   -1,   -1, 0x61, 0x5a,   -1,   -1,   -1,   -1, 0x5e,   -1,
  0x63,   -1,   -1, 0x62, 0x64,   -1,   -1, 0x65,   -1,   -1,   -1,   -1, 0x6a, 0x69, 0x67,   -1,
    -1,   -1, 0x68,   -1,   -1,   -1,   -1,   -1, 0x66,   -1,   -1,   -1,   -1,   -1, 0x6b,   -1,
    -1,   -1,   -1,   -1, 0x73, 0x6f,   -1, 0x6d, 0x70, 0x72,   -1,   -1, 0x71, 0x6e,   -1,   -1,
    -1,   -1, 0x74, 0x6c,   -1, 0x7e,   -1,   -1, 0x7c,   -1, 0x7b,   -1, 0x7d,   -1, 0x79,   -1,
    -1, 0x7a, 0x76, 0x75,   -1,   -1, 0x78, 0x77,   -1,   -1,   -1,   -1,   -1,   -1, 0x80, 0x7f,
    -1, 0x89, 0x8a, 0x82, 0x8d,   -1,   -1,   -1, 0x8c,   -1,   -1, 0x86, 0x88, 0x85,   -1, 0x84,
  0x83, 0x87, 0x8b,   -1,   -1,   -1, 0x81,   -1,   -1,   -1,   -1, 0x95, 0x91,   -1,   -1, 0x90,
    -1,   -1, 0x98,   -1,   -1, 0x8e, 0x92,   -1,   -1,   -1, 0x97, 0x96, 0x93,   -1, 0x94,   -1,
  0x8f,   -1,   -1, 0xa0,   -1, 0x9b, 0x9f,   -1,   -1,   -1,   -1,   -1,   -1, 0x99,   -1, 0x9e,
    -1,   -1,   -1,   -1, 0x9c, 0x9d,   -1,   -1,   -1,   -1, 0x9a,   -1,   -1,   -1,   -1,   -1,
  0xa2,   -1,   -1,   -1,   -1,   -1,   -1, 0xa6,   -1, 0xa5,   -1,   -1,   -1,   -1, 0xa7, 0xa3,
    -1,   -1,   -1, 0xa4, 0xa1,   -1, 0xb1,   -1,   -1, 0xa8, 0xaf, 0xb0,   -1,   -1,   -1,   -1,
  0xaa, 0xae, 0xad,   -1,   -1,   -1,   -1, 0xb2, 0xac, 0xa9,   -1,   -1,   -1,   -1, 0xab,   -1,
    -1,   -1,   -1, 0xb3,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
    -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1, 0xb4,   -1,   -1,   -1, 0xba, 0xb5, 0xbc,
    -1, 0xb9,   -1,   -1, 0xbb, 0xb7,   -1, 0xbe, 0xb8, 0xb6,   -1,   -1, 0xbf, 0xc0,   -1,   -1,
    -1,   -1, 0xbd,   -1, 0xc2, 0xcb,   -1,   -1, 0xc1, 0xcc, 0xca,   -1,   -1,   -1, 0xc5,   -1,
    -1, 0xcd, 0xc9, 0xc8,   -1, 0xc3, 0xc4, 0xc7,   -1,   -1, 0xc6,   -1,   -1,   -1, 0xd9, 0xd6,
    -1, 0xd2, 0xd3,   -1,   -1,   -1, 0xd0,   -1, 0xcf, 0xd5,   -1, 0xda, 0xce, 0xd8,   -1,   -1,
  0xd7, 0xd1,   -1,   -1,   -1,   -1, 0xd4,   -1,   -1,   -1,   -1,   -1, 0xde,   -1,   -1,   -1,
    -1,   -1,   -1,   -1,   -1,   -1, 0xdc,   -1,   -1, 0xdf,   -1, 0xdd,   -1,   -1,   -1,   -1,
  0xdb,   -1, 0xe6,   -1,   -1, 0xe7, 0xe4,   -1,   -1,   -1,   -1,   -1,   -1, 0xe3,   -1,   -1,
  0xe2,   -1,   -1,   -1, 0xe8, 0xe0,   -1,   -1, 0xe5,   -1, 0xe1,   -1,   -1,   -1,   -1, 0xea,
  0xed, 0xf3,   -1,   -1,   -1,   -1, 0xf4, 0xe9, 0xeb, 0xf1,   -1, 0xec,   -1,   -1, 0xef, 0xf0,
    -1,   -1,   -1,   -1, 0xee, 0xf2,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
    -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
  0xf8,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1, 0xf5, 0xf7,   -1, 0xf6,   -1,   -1,
    -1,   -1,   -1, 0xf9,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1, 0xfd,   -1, 0xfe,   -1,
    -1,   -1,   -1,   -1,   -1,   -1, 0xff,   -1, 0xfb,   -1,   -1,   -1, 0xfa, 0xfc,   -1,   -1,
    -1,   -1,   -1,   -1];

const args = process.argv.slice(2);

function fatal(message) {
  console.log("Error: " + message);
  process.exit(3);
}

function testArg(numberOf) {
  if (args.length != numberOf) {
    fatal("expected " + numberOf + " arguments");
  }
}

function strip(argNo, argEqual) {
  let arg = args[argNo];
  if (arg.length <= argEqual.length || arg.substring(0, argEqual.length) != argEqual) {
    fatal("expected '" + argEqual + "argument'");
  }
  return arg.substring(argEqual.length);
}

function byteWordsEncode(byteArray) {
  let byteWords = "";
  byteArray.forEach(byte => {
    byteWords += TO_BYTEWORDS[byte];
  });
  return byteWords;
}

function subjectCommand() {
  testArg(3);
  let type = strip(1, "type=");
  let argument = args[2];
  let cbor;
  switch (type) {
    case "cbor":
      cbor = CBOR.decode(CBOR.fromHex(argument));
      break;

    case "diag":
      cbor = CBOR.diagDecode(argument);
      break;

    case "data":
      cbor = CBOR.Bytes(CBOR.fromHex(argument));
      break;

    case "uri":
      cbor = CBOR.Tag(URI_TAG, CBOR.String(argument));
      break;

    case "string":
      cbor = CBOR.String(argument);
      break;

    case "number":
      if (argument.match(/^[\-\+]?\d+$/)) {
        let bigInt = BigInt(argument);
        // dCBOR limit checking
        if (bigInt > 0xffffffffffffffffn || bigInt < -0x8000000000000000n) {
          fatal("integer out of range: " + argument);
        }
        cbor = CBOR.BigInt(bigInt);
      } else {
        cbor = CBOR.Float(Number(argument));
      }
      break;

    default:
      fatal("unknown type: " + type);
  }
  let envelope = CBOR.Tag(ENVELOPE_TAG, CBOR.Tag(SUBJECT_TAG, cbor));
  console.log(envelope.toString());
  console.log(ENVELOPE_UR + byteWordsEncode(envelope.encode()));
}

function formatCommand() {
}

if (args.length == 0) {
  console.log("envelope subject type={cbor|diag|data|uri|number} argument\n\
         format ");
  process.exit(3);
}
let command = args[0];
switch (command) {
  case "subject":
    subjectCommand();
    break;

  case "format":
    formatCommand();
    break;

  default:
    fatal("unknown command: " + command);
}