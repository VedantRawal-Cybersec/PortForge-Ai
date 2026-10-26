import { runIsolatedJavaScript } from "@/lib/sandbox";
import {flagshipExercises} from "./practiceFlagship";
import {appliedLabs} from "./practiceAppliedLabs";
import {capstoneExercises} from "./practiceCapstones";
export type TestCase={label:string;args:unknown[];expected:unknown};
export type Exercise={id:string;title:string;topic:string;level:string;brief:string;functionName:string;starter:string;hint:string;tests:TestCase[]};
export type TestResult={label:string;pass:boolean;expected:string;actual:string};
export type PracticeAttempt={id:string;exerciseId:string;code:string;reflection:string;results:TestResult[];passed:number;total:number;updatedAt:number};
const KEY="portforge_practice_v1";
export const exercises:Exercise[]=[
{id:"even-sum",title:"Sum even numbers",topic:"Arrays and conditions",level:"Beginner",brief:"Create sumEven(numbers). Return the sum of even numbers, including negative values. Empty arrays return zero.",functionName:"sumEven",starter:"function sumEven(numbers) {\n  // Your solution here\n  return 0;\n}",hint:"Loop through the values. The remainder operator (%) identifies even numbers.",tests:[{label:"Mixed numbers",args:[[1,2,3,4,6]],expected:12},{label:"Empty list",args:[[]],expected:0},{label:"Negative values",args:[[-4,-2,3]],expected:-6},{label:"Only odd",args:[[3,5,7]],expected:0}]},
{id:"normalize-name",title:"Clean up a name",topic:"String manipulation",level:"Beginner",brief:"Create normalizeName(text). Trim surrounding whitespace, collapse spaces and capitalize the first letter of every word while making remaining letters lowercase.",functionName:"normalizeName",starter:"function normalizeName(text) {\n  // Your solution here\n  return text;\n}",hint:"Use trim(), split(/\\s+/), map() and join(' ').",tests:[{label:"Mixed case",args:["  aDA   LOVELACE "],expected:"Ada Lovelace"},{label:"Single word",args:["gRACE"],expected:"Grace"},{label:"Empty value",args:["   "],expected:""},{label:"Already clean",args:["Alan Turing"],expected:"Alan Turing"}]},
{id:"longest-word",title:"Find the longest word",topic:"Loops and comparison",level:"Beginner",brief:"Create longestWord(words). Return the first longest word, or an empty string when no words are provided.",functionName:"longestWord",starter:"function longestWord(words) {\n  // Your solution here\n  return '';\n}",hint:"Update your result only if the next word is strictly longer, not when lengths tie.",tests:[{label:"Simple array",args:[["one","three","four"]],expected:"three"},{label:"Tie keeps first",args:[["alpha","bravo"]],expected:"alpha"},{label:"Empty array",args:[[]],expected:""},{label:"Single item",args:[["xyz"]],expected:"xyz"}]},
{id:"count-words",title:"Count words reliably",topic:"Text processing",level:"Intermediate",brief:"Create countWords(text) to count whitespace-separated words. Blank input counts as zero, and tabs and line breaks must work.",functionName:"countWords",starter:"function countWords(text) {\n  // Your solution here\n  return 0;\n}",hint:"Test text.trim() first, then split on the whitespace pattern /\\s+/.",tests:[{label:"Simple sentence",args:["Learn and build"],expected:3},{label:"Spaces and tabs",args:[" one   two \t three "],expected:3},{label:"Blank input",args:[" \t "],expected:0},{label:"Single word",args:["skill"],expected:1}]},
{id:"score-summary",title:"Summarize scores",topic:"Data and functions",level:"Intermediate",brief:"Create scoreSummary(scores) that returns {count,total,average}. For no scores return all zeros. Do not round the average.",functionName:"scoreSummary",starter:"function scoreSummary(scores) {\n  return {count:0,total:0,average:0};\n}",hint:"Calculate a total with reduce(), then divide by the number of values only when it is nonzero.",tests:[{label:"Typical values",args:[[10,20,30]],expected:{count:3,total:60,average:20}},{label:"Empty values",args:[[]],expected:{count:0,total:0,average:0}},{label:"Decimal average",args:[[1,2]],expected:{count:2,total:3,average:1.5}},{label:"Single value",args:[[90]],expected:{count:1,total:90,average:90}}]},
{id:"unique-values",title:"Remove duplicates",topic:"Arrays and sets",level:"Intermediate",brief:"Create uniqueValues(values) to remove repeated primitive values while preserving the order of first appearance.",functionName:"uniqueValues",starter:"function uniqueValues(values) {\n  return [];\n}",hint:"A Set remembers values already seen and maintains insertion order.",tests:[{label:"Repeated numbers",args:[[3,2,3,1,2]],expected:[3,2,1]},{label:"Different types",args:[["1",1,"1"]],expected:["1",1]},{label:"Empty list",args:[[]],expected:[]},{label:"Repeated booleans",args:[[false,false,true]],expected:[false,true]}]}
];
exercises.push(...flagshipExercises,...appliedLabs,...capstoneExercises);
export function getPractice():PracticeAttempt[]{
 try{
  const raw=JSON.parse(localStorage.getItem(KEY)||"[]");
  return Array.isArray(raw)?raw.filter((x:PracticeAttempt)=>x&&typeof x.exerciseId==="string"&&typeof x.code==="string"&&Array.isArray(x.results)).slice(0,30):[];
 }catch{return [];}
}
export function findPractice(id:string){return getPractice().find(x=>x.exerciseId===id);}
export function savePractice(attempt:PracticeAttempt){
 const arr=[{...attempt,code:attempt.code.slice(0,15000),reflection:attempt.reflection.slice(0,2000)},...getPractice().filter(x=>x.exerciseId!==attempt.exerciseId)].slice(0,30);
 localStorage.setItem(KEY,JSON.stringify(arr));
 window.dispatchEvent(new Event("portforge:practice"));
}
export async function assessExercise(exercise:Exercise,code:string):Promise<{results:TestResult[];logs:string[]}>{
 if(code.length>12000)throw new Error("Code is too long for the practice runner.");
 const nonce="PF_TEST_"+crypto.randomUUID()+"_";
 const harness="\n;(()=>{const tests="+JSON.stringify(exercise.tests)+";"+
 "const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);"+
 "for(const t of tests){let actual;let pass=false;try{const fn="+exercise.functionName+";"+
 "if(typeof fn!=='function')throw Error('Function missing');actual=fn(...t.args);pass=equal(actual,t.expected)}"+
 "catch(e){actual='[ERROR] '+String(e&&e.message||e)}"+
 "console.log("+JSON.stringify(nonce)+"+JSON.stringify({label:t.label,pass,expected:JSON.stringify(t.expected),actual:JSON.stringify(actual)??String(actual)}))"+
 "}})();";
 const logs=await runIsolatedJavaScript(code+harness,3000);
 const results:TestResult[]=[];
 for(const line of logs){const i=line.indexOf(nonce);if(i<0)continue;try{const obj=JSON.parse(line.slice(i+nonce.length));results.push({label:String(obj.label),pass:obj.pass===true,expected:String(obj.expected),actual:String(obj.actual)});}catch{}}
 if(results.length!==exercise.tests.length)throw new Error("Tests could not finish. Check for syntax errors, early returns or infinite loops.");
 return {results,logs:logs.filter(x=>!x.includes(nonce))};
}
