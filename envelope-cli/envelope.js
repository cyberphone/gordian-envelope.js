// Gordian Envelope CLI
import CBOR from 'cbor-object';

const ENVELOPE_TAG = 200n;
const SUBJECT_TAG = 24n;
const URI_TAG = 32n;

const ENVELOPE_UR = "ur:envelope/";

const BYTEWORDS = "ableacidalsoapexaquaarchatomauntawayaxisbackbaldbarnbeltbetabias\
bluebodybragbrewbulbbuzzcalmcashcatschefcityclawcodecolacookcost\
cruxcurlcuspcyandarkdatadaysdelidicedietdoordowndrawdropdrumdull\
dutyeacheasyechoedgeepicevenexamexiteyesfactfairfernfigsfilmfish\
fizzflapflewfluxfoxyfreefrogfuelfundgalagamegeargemsgiftgirlglow\
goodgraygrimgurugushgyrohalfhanghardhawkheathelphighhillholyhope\
hornhutsicedideaidleinchinkyintoirisironitemjadejazzjoinjoltjowl\
judojugsjumpjunkjurykeepkenokeptkeyskickkilnkingkitekiwiknoblamb\
lavalazyleaflegsliarlimplionlistlogoloudloveluaulucklungmainmany\
mathmazememomenumeowmildmintmissmonknailnavyneednewsnextnoonnote\
numbobeyoboeomitonyxopenovalowlspaidpartpeckplaypluspoempoolpose\
puffpumapurrquadquizraceramprealredorichroadrockroofrubyruinruns\
rustsafesagascarsetssilkskewslotsoapsolosongstubsurfswantacotask\
taxitenttiedtimetinytoiltombtoystriptunatwinuglyundouniturgeuser\
vastveryvetovialvibeviewvisavoidvowswallwandwarmwaspwavewaxywebs\
whatwhenwhizwolfworkyankyawnyellyogayurtzapszerozestzinczonezoom";

const args = process.argv.slice(2);

function fatal(error) {
  console.log(error);
  process.exit(3);
}

function testArg(numberOf) {
  if (args.length != numberOf) {
    fatal("Expected " + numberOf + " arguments");
  }
}

function strip(argNo, argEqual) {
  let arg = args[argNo];
  if (arg.length <= argEqual.length || arg.substring(0, argEqual.length) != argEqual) {
    fatal("Expected '" + argEqual + "argument'");
  }
  return arg.substring(argEqual.length);
}

function byteWordsEncode(byteArray) {
  let byteWords = "";
  byteArray.forEach(byte => {
    let v = byte * 4;
    byteWords += BYTEWORDS.charAt(v) + BYTEWORDS.charAt(v + 3);
  });
  return byteWords;
}

function subject() {
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
          fatal("Integer out of range: " + argument);
        }
        cbor = CBOR.BigInt(bigInt);
      } else {
        cbor = CBOR.Float(Number(argument));
      }
      break;

    default:
      fatal("Unknown type: " + type);
  }
  let envelope = CBOR.Tag(ENVELOPE_TAG, CBOR.Tag(SUBJECT_TAG, cbor));
  console.log(envelope.toString());
  console.log(ENVELOPE_UR + byteWordsEncode(envelope.encode()));
}

if (args.length == 0) {
  console.log("envelope subject type={cbor|diag|data|uri|number} argument\n\
         other");
  process.exit(3);
}
switch (args[0]) {
  case "subject":
    subject();
    break;
  default:
    console.log("Unknown command");
    process.exit(3);
}