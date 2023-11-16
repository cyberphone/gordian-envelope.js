// Program to create ByteWords tables

const BYTEWORDS = "\
ableacidalsoapexaquaarchatomauntawayaxisbackbaldbarnbeltbetabias\
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

let bytewords = "const TO_BYTEWORDS = [";
for (let q = 0; q < BYTEWORDS.length; q += 4) {
  if (q) {
    bytewords += ",";
  }
  if (q % 64 == 0) {
    bytewords += "\n  ";
  } else {
    bytewords += " ";
  }
  bytewords += "'" + BYTEWORDS[q] + BYTEWORDS[q + 3] + "'";
}
bytewords += "];\n\n";

let g = eval(bytewords + "TO_BYTEWORDS;");
bytewords += "const FROM_BYTEWORDS = [";
for (let q = 0; q < 26*26; q++) {
  let entry = "  -1"
  let search = String.fromCharCode(Number.parseInt(q / 26) + 0x61) + String.fromCharCode(Number.parseInt(q % 26) + 0x61);
  for (let i = 0; i < g.length; i++) {
    if (g[i] == search) {
      entry = i.toString(16);
      if (entry.length == 1) entry = "0" + entry;
      entry = "0x" + entry;
      break;
    }
  };
  if (q) {
    bytewords += ",";
  }
  if (q % 16 == 0) {
    bytewords += "\n  ";
  } else {
    bytewords += " ";
  }
  bytewords += entry;
}
bytewords += "];\n\n";

console.log(bytewords);


