/* Real-browser smoke test of public routes and the isolated learner runtime. */
const { chromium } = require("playwright");
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");
const base = "http://127.0.0.1:4173";
const delay = ms => new Promise(resolve => setTimeout(resolve,ms));
const server = spawn(process.execPath,["node_modules/vite/bin/vite.js","preview","--host","127.0.0.1","--port","4173","--strictPort"],{stdio:["ignore","pipe","pipe"]});
server.stderr.on("data",d=>process.stderr.write(String(d)));
let browser;
async function run(){
  let alive=false;
  for(let i=0;i<40;i++){
    try { const r=await fetch(base);if(r.ok){alive=true;break;} }catch{}
    await delay(500);
  }
  if(!alive)throw Error("Preview server did not become ready");
  browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  const paths=["/","/dashboard","/learn","/portfolio","/skill-dna","/missions","/workspace","/skill-test","/interview","/oracle"];
  for(const path of paths){
    const resp=await page.goto(base+path,{waitUntil:"domcontentloaded"});
    assert(resp&&resp.ok(),"route "+path+" returned non-2xx");
    await page.locator("#main-content").waitFor({state:"visible",timeout:10000});
    const text=(await page.locator("#main-content").innerText()).trim();
    assert(text.length>40,"route "+path+" rendered empty content");
    if(errors.length)throw Error(path+" browser error: "+errors.join("; "));
    process.stdout.write("OK "+path+" ("+text.length+" chars)\n");
  }
  await page.goto(base+"/");
  await page.getByRole("button",{name:"Switch to light mode"}).click();
  assert(await page.evaluate(()=>document.documentElement.classList.contains("light")),"light theme not applied");
  await page.goto(base+"/dashboard");
  await page.waitForFunction(()=>document.documentElement.classList.contains("light"),null,{timeout:6000});
  await page.getByRole("button",{name:"Switch to dark mode"}).click();
  await page.goto(base+"/missions");
  await page.getByText("Create a program with a variable.").click();
  assert((await page.locator("#main-content").innerText()).includes("1 / 3 STEPS CHECKED"),"mission progress not saved");
  process.stdout.write("OK theme toggle and mission checklist\n");
  await page.goto(base+"/dashboard");
  await page.getByPlaceholder("Your name").fill("Smoke Learner");
  await page.getByRole("button",{name:/save preferences/i}).click();
  assert((await page.locator("#main-content").innerText()).includes("Preferences saved locally."),"dashboard preferences not saved");
  await page.goto(base+"/learn");
  await page.getByRole("button",{name:/A browser requests webpage content from a server/i}).click();
  await page.getByText("Correct — lesson completed.").waitFor({timeout:7000});
  await page.goto(base+"/dashboard");
  assert((await page.locator("#main-content").innerText()).includes("1/12"),"lesson progress not reflected in dashboard");
  process.stdout.write("OK dashboard and learning persistence\n");
  await page.goto(base+"/workspace");
  await page.locator("textarea").first().fill('console.log("PORTFORGE_SMOKE")');
  await page.getByRole("button",{name:/RUN JAVASCRIPT/i}).click();
  await page.getByText("PORTFORGE_SMOKE",{exact:false}).last().waitFor({timeout:9000});
  await page.locator("textarea").first().fill('localStorage.setItem("portforge_escape","bad"); console.log("ISOLATED");');
  await page.getByRole("button",{name:/RUN JAVASCRIPT/i}).click();
  await page.getByText("ISOLATED",{exact:false}).last().waitFor({timeout:9000});
  const escaped=await page.evaluate(()=>localStorage.getItem("portforge_escape"));
  assert.equal(escaped,null,"sandbox code modified application localStorage");
  process.stdout.write("OK isolated browser code runner and storage security check\n");
  assert.equal(errors.length,0,"unhandled browser errors: "+errors.join("; "));
  await context.close();
}
run().then(()=>{process.stdout.write("All browser checks passed\n");}).catch(e=>{process.stderr.write(String(e.stack||e)+"\n");process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.kill("SIGTERM");});
