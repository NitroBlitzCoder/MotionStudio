const colors={red:'#e34f4f',blue:'#4285dc',green:'#4baf79',yellow:'#edc74b',orange:'#ef923f',purple:'#8b65ce',violet:'#8b65ce',pink:'#df78a1',black:'#171c2c',white:'#ffffff',brown:'#8b5e3c',gray:'#858585',grey:'#858585',teal:'#399c9c'};
/** Deliberately narrow grammar: never guess destructive or compound commands. */
export function parseCommand(transcript){let text=transcript.toLowerCase().replace(/[.,!?]/g,'').trim().replace(/^please\s+/,'').replace(/\s+please$/,'');
 const units={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
 text=text.replace(/\b(?:(?:one )?hundred(?: and)?(?: (?:twenty|ten))?|(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:[ -](?:one|two|three|four|five|six|seven|eight|nine))?|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\b/g,phrase=>{if(phrase.includes('hundred'))return String(100+(phrase.includes('twenty')?20:phrase.includes('ten')?10:0));return String(phrase.split(/[ -]/).reduce((sum,w)=>sum+(units[w]||0),0))});
 let m=text.match(/^(?:(?:change|switch)(?: (?:the )?tool)? to|select|use|pick up)(?: the| a)? (pen|brush|marker|eraser)$/);if(m)return {type:'tool',value:m[1]};
 m=text.match(/^(?:(?:change|set)(?: the)? (?:colou?r|brush colou?r|pen colou?r) to|use)(?: the)? (red|blue|green|yellow|orange|purple|violet|pink|black|white|brown|gray|grey|teal)$/);if(m)return {type:'color',value:colors[m[1]]};
 m=text.match(/^(?:set|change)(?: the)? (?:brush )?size(?: to)? (\d{1,3})(?: pixels?)?$/);if(m&&+m[1]>=1&&+m[1]<=120)return {type:'size',value:+m[1]};
 m=text.match(/^(?:set|change)(?: the)? opacity(?: to)? (\d{1,3})(?: percent|%)?$/);if(m&&+m[1]>=5&&+m[1]<=100)return {type:'opacity',value:+m[1]/100};
 return null;
}
