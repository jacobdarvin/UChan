const regex =/[>]{2}[\d]{7}/gm;

const text = `>>1234567 
>>6548789
 foo barr`;
console.log(text)

const matches = text.match(regex);

console.log(matches);
return;
var str = '>>1000099 \r\n ok bro',
    delimiter = '>',
    start = 2,
    tokens = str.split(delimiter).slice(start),
    result = tokens.join(delimiter); // those.that
    
console.log(parseInt(result))