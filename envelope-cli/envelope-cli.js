// Gordian Envelope CLI
import CBOR from 'cbor-object';
import Crypto from 'node:crypto';

const ENVELOPE_TAG = 200n;
const SUBJECT_TAG  = 24n;
const DATE_TAG     = 0n;
const URI_TAG      = 32n;

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

const CRC32_TABLE = [
  0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f, 0xe963a535, 0x9e6495a3,
  0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91,
  0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7,
  0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9, 0xfa0f3d63, 0x8d080df5,
  0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b,
  0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
  0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f,
  0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924, 0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d,
  0x76dc4190, 0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433,
  0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
  0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457,
  0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
  0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb,
  0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9,
  0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
  0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad,
  0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683,
  0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
  0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb, 0x196c3671, 0x6e6b06e7,
  0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
  0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b,
  0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79,
  0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236, 0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f,
  0xc5ba3bbe, 0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
  0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713,
  0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21,
  0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
  0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45,
  0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db,
  0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
  0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693, 0x54de5729, 0x23d967bf,
  0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d];

const args = process.argv.slice(2);

function fatal(message) {
  console.log("Error: " + message);
  process.exit(3);
}

function testArg(numberOf) {
  if (args.length != numberOf) fatal("expected " + numberOf + " arguments");
}

function strip(argNo, argEqual) {
  let arg = args[argNo];
  if (arg.length <= argEqual.length || arg.substring(0, argEqual.length) != argEqual) {
    fatal("expected '" + argEqual + "argument'");
  }
  return arg.substring(argEqual.length);
}

function byteWordsEncode(byteArray) {
 // console.log(CBOR.toHex(byteArray));
  byteArray = CBOR.addArrays(byteArray, crc32(byteArray));
  let byteWords = "";
  byteArray.forEach(byte => {
    byteWords += TO_BYTEWORDS[byte];
  });
  return byteWords;
}

function convertToNum(byteWords, index) {
  return byteWords.charCodeAt(index) - 0x61;
}

function byteWordsDecode(byteWords) {
  let length = byteWords.length;
  if (length <= 8) fatal("missing ByteWord checksum");
  if (length & 1) fatal("uneven number of ByteWord characters");
  if (!byteWords.match(/^[a-z]+?$/)) fatal("invalid ByteWord characters");
  let bytes = new Uint8Array(length >> 1);
  for (let i = 0, q = 0; q < length;) {
    let byte = FROM_BYTEWORDS[(convertToNum(byteWords, q++) * 26) + convertToNum(byteWords, q++)];
    if (byte < 0) fatal("invalid ByteWord");
    bytes[i++] = byte;
  }
  let result = bytes.subarray(0, bytes.length - 4);
  if (CBOR.compareArrays(crc32(result), bytes.subarray(result.length))) fatal("crc32 mismatch");
  // console.log(CBOR.toHex(result));
  return result;
}

function crc32 (byteArray) {
  let crc = -1;
  byteArray.forEach(byte => {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ byte) & 0xff];
  });
  crc ^= 0xffffffff;
  let result = new Uint8Array(4);
  for (let i = 3; i >= 0; i--) {
    result[i] = crc;
    crc >>>= 8;
  }
  return result;
}

function getEnvelope(atIndex) {
  return CBOR.Tag(ENVELOPE_TAG, CBOR.decode(byteWordsDecode(strip(atIndex, "ur:envelope/"))));
}

function subjectCommand() {
  testArg(4);
  if (args[1] != "type") fatal("missing \"type\" argument");
  let type = args[2];
  let argument = args[3];
  let cborObject;
  switch (type) {
    case "cborObject":
      cborObject = CBOR.decode(CBOR.fromHex(argument));
      break;

    case "diag":
      cborObject = CBOR.diagDecode(argument);
      break;

    case "data":
      cborObject = CBOR.Bytes(CBOR.fromHex(argument));
      break;

    case "date":
      cborObject = CBOR.Tag(DATE_TAG, CBOR.String(argument));
      break;

    case "uri":
      cborObject = CBOR.Tag(URI_TAG, CBOR.String(argument));
      break;

    case "string":
      cborObject = CBOR.String(argument);
      break;

    case "number":
      if (argument.match(/^[\-\+]?\d+$/)) {
        let bigInt = BigInt(argument);
        // dCBOR limit checking
        if (bigInt > 0xffffffffffffffffn || bigInt < -0x8000000000000000n) {
          fatal("integer out of range: " + argument);
        }
        cborObject = CBOR.BigInt(bigInt);
      } else {
        cborObject = CBOR.Float(Number(argument));
      }
      break;

    default:
      fatal("unknown type: " + type);
  }
  let envelope = CBOR.Tag(SUBJECT_TAG, cborObject).encode();
  process.stdout.write(ENVELOPE_UR + byteWordsEncode(envelope));
}

function formatCommand() {
  let type;
  let cborObject;
  if (args.length == 2) {
    type = "envelope";
    cborObject = getEnvelope(1);
  } else {
    testArg(4);
    if (args[1] != "--type") fatal("\"--type\" missing");
    type = args[2];
    cborObject = getEnvelope(3);
  }
  switch (type) {
    case "cbor":
      console.log(CBOR.toHex(cborObject.encode()));
      break;

    case "diag":
      console.log(cborObject.toString());
      break;

    case "envelope":
      fatal("not implemented");
      break;

    default:
      fatal("unknown type: " + type);
  }
}

function digestCommand() {
  testArg(2);
  const hash = Crypto.createHash('sha256');
  hash.update(getEnvelope(1).getTaggedObject().encode());
  console.log(byteWordsEncode(new Uint8Array(hash.digest())));
}

function rawCommand() {
  testArg(2);
  let argument = args[1];
  let index = argument.indexOf("/");
  console.log(CBOR.toHex(byteWordsDecode(index >= 0 ? argument.substring(index + 1) : argument)));
}

// Here it all begins...
if (args.length == 0) {
  console.log("\nenvelope subject type {cbor|diag|data|date|uri|number} argument\n\
         format [--type {cbor|diag}] ur:envelope/ccccc\n\
         digest ur:envelope/ccccc\n\
         raw [ur:xxxxx/]ccccc");
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

  case "digest":
    digestCommand();
    break;

  case "raw":
    rawCommand();
    break;

  default:
    fatal("unknown command: " + command);
}