/**
 * Read-only gate checks by default.
 * Set PORTFORGE_LIVE_AI_TESTS=YES and provide two dedicated test account tokens to
 * opt in to real billable calls. Never commit or print tokens.
 *
 * PORTFORGE_SUPABASE_URL=https://<ref>.supabase.co
 * PORTFORGE_PUBLISHABLE_KEY=<publishable-key>
 * PORTFORGE_TEST_TOKEN_A=<short-lived-test-user-jwt>
 * PORTFORGE_TEST_TOKEN_B=<short-lived-other-user-jwt>
 * node scripts/verify-live-interfaces.mjs
 */
import assert from "node:assert/strict";
const env=process.env;
const url=(env.PORTFORGE_SUPABASE_URL||"").replace(/\/$/,"");
const apikey=env.PORTFORGE_PUBLISHABLE_KEY||"";
const tokenA=env.PORTFORGE_TEST_TOKEN_A||"";
const tokenB=env.PORTFORGE_TEST_TOKEN_B||"";
if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) || !apikey){
  process.stderr.write("Missing PORTFORGE_SUPABASE_URL or PORTFORGE_PUBLISHABLE_KEY. No requests made.\n");
  process.exit(2);
}
async function callFunction(fn,body,token=""){
  const headers={"content-type":"application/json","apikey":apikey};
  if(token)headers.authorization="Bearer "+token;
  const result=await fetch(url+"/functions/v1/"+fn,{method:"POST",headers,body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
  let bodyOut;
  try{bodyOut=await result.json()}catch{bodyOut={};}
  return {status:result.status,data:bodyOut};
}
try{
  const anon=await callFunction("ai-evaluate",{mode:"question",skill:"SQL",difficulty:"beginner"});
  assert.equal(anon.status,401,"No-token request must be rejected with 401 BEFORE billing.");
  process.stdout.write("PASS unauthenticated AI requests rejected.\n");
  const anonVoice=await callFunction("tts",{text:"Test"});
  assert.equal(anonVoice.status,401,"No-token voice synthesis must be rejected.");
  process.stdout.write("PASS unauthenticated voice requests rejected.\n");
  if(env.PORTFORGE_LIVE_AI_TESTS!=="YES"){
    process.stdout.write("AI provider tests SKIPPED (set PORTFORGE_LIVE_AI_TESTS=YES and provide two dedicated user tokens).\n");
    process.exit(0);
  }
  if(!tokenA||!tokenB||tokenA===tokenB)throw new Error("Provide two DIFFERENT signed-in test-user tokens.");
  const questions=[];
  for(const difficulty of ["beginner","intermediate","advanced"]){
    const r=await callFunction("ai-evaluate",{mode:"question",skill:"SQL",difficulty},tokenA);
    assert.equal(r.status,200,"Authenticated "+difficulty+" question failed.");
    assert.ok(typeof r.data.question==="string" && r.data.question.trim().length>15,"Malformed generated question.");
    questions.push(r.data.question);
    process.stdout.write("PASS "+difficulty+" AI question contract; inspect the following question for subjective level fit:\n  "+r.data.question.slice(0,250)+"\n");
  }
  assert.equal(new Set(questions).size,3,"All three difficulties returned identical questions.");
  const review=await callFunction("ai-evaluate",{mode:"evaluate",skill:"SQL",difficulty:"beginner",
    question:"What does SELECT do in SQL?",answer:"SELECT fetches values from columns in selected table rows."},tokenA);
  assert.equal(review.status,200,"Authenticated evaluation returned non-200.");
  for(const key of ["logic","clarity","depth"]){
    assert.ok(typeof review.data.scores?.[key]==="number" && review.data.scores[key]>=0&&review.data.scores[key]<=5,
      "Missing or invalid "+key+" score");
  }
  assert.ok(typeof review.data.idealAnswer==="string"&&review.data.idealAnswer.length>10,"Missing worked example.");
  process.stdout.write("PASS real AI evaluation schema.\n");
  for(let round=1;round<=3;round++){
    const x=await callFunction("ai-evaluate",{mode:"interview_question",skill:"Frontend Developer",difficulty:"intermediate",index:round},tokenB);
    assert.equal(x.status,200,"Interview round "+round+" failed.");
    assert.ok(typeof x.data.question==="string" && x.data.question.length>12);
    process.stdout.write("PASS interview round "+round+": "+x.data.question.slice(0,220)+"\n");
  }
  process.stdout.write("Live contracts pass. Manual pedagogical review and two-user database RLS tests remain separately required.\n");
}catch(error){
  process.stderr.write("FAIL: "+(error instanceof Error?error.message:"Live verification error")+". No credentials were printed.\n");
  process.exitCode=1;
}
