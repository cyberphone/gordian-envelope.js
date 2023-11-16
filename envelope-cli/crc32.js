// CRC32 code and table generator
import CBOR from 'cbor-object';
// Gordian Envelope CLI

var a_table = "00000000 77073096 ee0e612c 990951ba 076dc419 706af48f e963a535 9e6495a3 0edb8832 79dcb8a4 e0d5e91e 97d2d988 09b64c2b 7eb17cbd e7b82d07 90bf1d91 1db71064 6ab020f2 f3b97148 84be41de 1adad47d 6ddde4eb f4d4b551 83d385c7 136c9856 646ba8c0 fd62f97a 8a65c9ec 14015c4f 63066cd9 fa0f3d63 8d080df5 3b6e20c8 4c69105e d56041e4 a2677172 3c03e4d1 4b04d447 d20d85fd a50ab56b 35b5a8fa 42b2986c dbbbc9d6 acbcf940 32d86ce3 45df5c75 dcd60dcf abd13d59 26d930ac 51de003a c8d75180 bfd06116 21b4f4b5 56b3c423 cfba9599 b8bda50f 2802b89e 5f058808 c60cd9b2 b10be924 2f6f7c87 58684c11 c1611dab b6662d3d 76dc4190 01db7106 98d220bc efd5102a 71b18589 06b6b51f 9fbfe4a5 e8b8d433 7807c9a2 0f00f934 9609a88e e10e9818 7f6a0dbb 086d3d2d 91646c97 e6635c01 6b6b51f4 1c6c6162 856530d8 f262004e 6c0695ed 1b01a57b 8208f4c1 f50fc457 65b0d9c6 12b7e950 8bbeb8ea fcb9887c 62dd1ddf 15da2d49 8cd37cf3 fbd44c65 4db26158 3ab551ce a3bc0074 d4bb30e2 4adfa541 3dd895d7 a4d1c46d d3d6f4fb 4369e96a 346ed9fc ad678846 da60b8d0 44042d73 33031de5 aa0a4c5f dd0d7cc9 5005713c 270241aa be0b1010 c90c2086 5768b525 206f85b3 b966d409 ce61e49f 5edef90e 29d9c998 b0d09822 c7d7a8b4 59b33d17 2eb40d81 b7bd5c3b c0ba6cad edb88320 9abfb3b6 03b6e20c 74b1d29a ead54739 9dd277af 04db2615 73dc1683 e3630b12 94643b84 0d6d6a3e 7a6a5aa8 e40ecf0b 9309ff9d 0a00ae27 7d079eb1 f00f9344 8708a3d2 1e01f268 6906c2fe f762575d 806567cb 196c3671 6e6b06e7 fed41b76 89d32be0 10da7a5a 67dd4acc f9b9df6f 8ebeeff9 17b7be43 60b08ed5 d6d6a3e8 a1d1937e 38d8c2c4 4fdff252 d1bb67f1 a6bc5767 3fb506dd 48b2364b d80d2bda af0a1b4c 36034af6 41047a60 df60efc3 a867df55 316e8eef 4669be79 cb61b38c bc66831a 256fd2a0 5268e236 cc0c7795 bb0b4703 220216b9 5505262f c5ba3bbe b2bd0b28 2bb45a92 5cb36a04 c2d7ffa7 b5d0cf31 2cd99e8b 5bdeae1d 9b64c2b0 ec63f226 756aa39c 026d930a 9c0906a9 eb0e363f 72076785 05005713 95bf4a82 e2b87a14 7bb12bae 0cb61b38 92d28e9b e5d5be0d 7cdcefb7 0bdbdf21 86d3d2d4 f1d4e242 68ddb3f8 1fda836e 81be16cd f6b9265b 6fb077e1 18b74777 88085ae6 ff0f6a70 66063bca 11010b5c 8f659eff f862ae69 616bffd3 166ccf45 a00ae278 d70dd2ee 4e048354 3903b3c2 a7672661 d06016f7 4969474d 3e6e77db aed16a4a d9d65adc 40df0b66 37d83bf0 a9bcae53 debb9ec5 47b2cf7f 30b5ffe9 bdbdf21c cabac28a 53b39330 24b4a3a6 bad03605 cdd70693 54de5729 23d967bf b3667a2e c4614ab8 5d681b02 2a6f2b94 b40bbe37 c30c8ea1 5a05df1b 2d02ef8d";
var b_table = a_table.split(' ').map(function(s){ return parseInt(s,16) });
function s_crc32 (str) {
    var crc = -1;
    for(var i=0, iTop=str.length; i<iTop; i++) {
        crc = ( crc >>> 8 ) ^ b_table[( crc ^ str.charCodeAt( i ) ) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
}

function b_crc32 (byteArray) {
    var crc = -1;
    for(var i=0, iTop=byteArray.length; i<iTop; i++) {
        crc = ( crc >>> 8 ) ^ b_table[( crc ^ byteArray[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
}

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
  console.log("HEX=" + CBOR.toHex(result));
  return result;
}

let byteArray = CBOR.fromHex("d9012ca20150c7098580125e2ab0981253468b2dbc5202d8641947da");
console.log(b_crc32(byteArray));
console.log(crc32(byteArray));
console.log(b_crc32(new Uint8Array([0])));

