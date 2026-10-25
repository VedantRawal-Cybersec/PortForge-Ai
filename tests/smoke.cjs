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
  const paths=["/","/dashboard","/learn","/portfolio","/account","/skill-dna","/missions","/data-use","/my-data","/practice","/project-interview","/workspace","/skill-test","/interview","/oracle"];
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
  await page.goto(base+"/practice");
  await page.getByLabel("Your JavaScript solution").fill("function sumEven(numbers) { return numbers.filter(n => n % 2 === 0).reduce((sum,n) => sum+n,0); }");
  await page.getByRole("button",{name:"Run practice tests"}).click();
  await page.getByText("4/4").last().waitFor({timeout:9000});
  await page.getByLabel("Project reflection").fill("I filtered the input array to keep even numbers and then used reduce to add the values. I verified empty inputs and negative even values with test cases.");
  await page.getByRole("button",{name:"Save notes"}).click();
  await page.goto(base+"/project-interview?exercise=even-sum");
  await page.getByLabel("Your answer").fill("I had to sum only even numbers including negative numbers. I filtered the input and then reduced the matching values, keeping the initial total at zero.");
  await page.getByRole("button",{name:"Save answers"}).click();
  await page.getByText("Interview rehearsal saved on this device.").waitFor({timeout:7000});
  await page.goto(base+"/portfolio");
  await page.getByText("Independent challenge work").waitFor({timeout:7000});
  await page.getByText("Project interview stories").waitFor({timeout:7000});
  await page.goto(base+"/oracle");
  await page.getByRole("button",{name:/Use this learning path/i}).click();
  await page.getByText("Frontend Developer").last().waitFor({timeout:7000});
  await page.getByRole("checkbox",{name:/Completed Understand the Web/i}).check();
  await page.goto(base+"/oracle");
  await page.getByText("1/4 self-tracked milestones").waitFor({timeout:7000});
  process.stdout.write("OK independent practice, interview story, portfolio and persistent career roadmap\n");
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
  await page.goto(base+"/my-data");
  const downloadPromise=page.waitForEvent("download");
  await page.getByRole("button",{name:"Download backup"}).click();
  const download=await downloadPromise;
  assert(download.suggestedFilename().endsWith(".json"),"missing JSON backup download");
  const backup={format:"portforge-local-backup",version:1,createdAt:new Date().toISOString(),items:{portforge_profile_v2:{name:"Restored Learner",goal:"explore",level:"new",focus:"digital",headline:"",bio:"",links:[],visibility:"private"}}};
  await page.locator("#backup-file").setInputFiles({name:"portforge-local-backup.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(backup))});
  page.once("dialog",dialog=>dialog.accept());
  await page.getByRole("button",{name:"Restore selected file"}).click();
  await page.getByText(/Restored 1 browser-local sections/i).waitFor({timeout:7000});
  await page.goto(base+"/dashboard");
  await page.getByText("Welcome back, Restored Learner.").waitFor({timeout:7000});
  process.stdout.write("OK portable backup, restoration and public data settings\n");
  // Commercial UI regression: five-tool navigation, interactive hero and safe portfolio preview.
  await page.goto(base + "/");
  const tabs = page.getByRole("tab");
  await tabs.first().waitFor({state:"visible",timeout:10000});
  assert.equal(await tabs.count(), 5, "homepage must display exactly five core-tool preview tabs");
  await page.getByRole("tab", { name: "Portfolio" }).click();
  await page.getByRole("heading", { name: "Turn your effort into a story." }).waitFor();
  assert.equal(await page.getByRole("tab", { name: "Portfolio" }).getAttribute("aria-selected"), "true");
  const primaryLinks = page.locator('nav[aria-label="Mobile navigation"] a');
  assert.equal(await primaryLinks.count(), 5, "mobile primary navigation should retain five tools");
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  assert(!horizontalOverflow, "mobile landing page overflows horizontally");
  await page.goto(base + "/portfolio");
  await page.getByRole("button", { name: "Create your first project" }).click();
  await page.getByPlaceholder("e.g. Task tracking dashboard").fill("Portfolio smoke project");
  await page.getByPlaceholder("Explain the problem, how your project works and why it matters.").fill("I built this real demonstration project to verify personal project editing and export.");
  await page.getByRole("button", { name: "Save project" }).click();
  await page.getByRole("heading", { name: "Portfolio smoke project" }).waitFor();
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Portfolio smoke project" }).waitFor();
  const preview = page.locator('iframe[title="Preview of your locally generated portfolio"]');
  await preview.waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Editorial" }).click();
  await page.getByRole("group", { name: "Preview device size" }).getByRole("button", { name: "Mobile", exact: true }).click();
  assert.equal(await page.getByRole("group", { name: "Preview device size" }).getByRole("button", { name: "Mobile", exact: true }).getAttribute("aria-pressed"), "true");
  assert((await preview.getAttribute("srcdoc")).includes("--bg:#f4efe6"), "portfolio theme should appear in live preview");
  assert.equal(await preview.getAttribute("sandbox"), "", "portfolio iframe must be sandboxed");
  assert((await preview.getAttribute("srcdoc")).includes("Portfolio smoke project"), "authored projects must appear in the exported preview");
  const portfolioDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Download portfolio HTML/i }).click();
  const portfolioDownload = await portfolioDownloadPromise;
  assert(portfolioDownload.suggestedFilename().endsWith(".html"), "portfolio export must download HTML");
  // Résumé studio: import saved projects, switch an actual template, and export readable files.
  await page.getByRole("button",{name:"Bring in my projects"}).click();
  const resumePreview=page.locator('iframe[title="Live preview of editable resume"]');
  await resumePreview.waitFor();
  assert((await resumePreview.getAttribute("srcdoc")).includes("Portfolio smoke project"),"resume should import genuine saved project");
  await page.getByRole("tab",{name:"Templates"}).click();
  await page.getByRole("button",{name:/Editorial Serif/i}).click();
  assert((await resumePreview.getAttribute("srcdoc")).includes("style-editorial"),"resume theme must change printable HTML");
  await page.getByRole("tab",{name:"Content"}).click();
  await page.getByPlaceholder("name@example.com").fill("test@example.com");
  await page.getByRole("button",{name:"Save draft"}).click();
  const resumeDownload=page.waitForEvent("download");
  await page.getByRole("button",{name:"Download plain text"}).click();
  const textResume=await resumeDownload;
  assert(textResume.suggestedFilename().endsWith(".txt"),"resume must export plain text");
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByRole("tab",{name:"Content"}).click();
  await page.getByPlaceholder("name@example.com").waitFor();
  assert.equal(await page.getByPlaceholder("name@example.com").inputValue(),"test@example.com","resume draft persists locally");
  process.stdout.write("OK resume templates, imported projects, A4 preview, text export and persistence\\n");
  process.stdout.write("OK premium homepage, five-tool navigation, mobile layout and portfolio studio preview/export\\n");
  // Complete both tools with their explicit, no-network offline choices.
  await page.goto(base + "/skill-test");
  await page.getByRole("button", { name: "SQL", exact: true }).click();
  await page.getByLabel("Question difficulty").selectOption("advanced");
  await page.getByRole("button", { name: /PRACTISE WITHOUT AI/i }).click();
  assert((await page.locator("#main-content").innerText()).includes("complex SQL query plan"), "advanced SQL question should match selected level");
  await page.getByText(/GUIDED OFFLINE PRACTICE/i).first().waitFor({timeout:15000});
  await page.getByPlaceholder("Type your answer. Be specific. Show reasoning.")
    .fill("An inner join returns matching records, but a left join also preserves rows in the left table.");
  await page.getByRole("button", { name: /REVIEW MY ANSWER/i }).click();
  await page.getByRole("heading", { name: "Self-review checklist" }).waitFor();
  await page.getByRole("checkbox",{name:/Self-review /}).first().check();
  for(let i=1;i<3;i++){
    await page.getByRole("button",{name:/Continue to question/i}).click();
    await page.getByPlaceholder("Type your answer. Be specific. Show reasoning.")
      .fill("I would inspect the sample and verify correctness using a small reproducible test.");
    await page.getByRole("button",{name:/REVIEW MY ANSWER/i}).click();
    await page.getByRole("heading",{name:"Self-review checklist"}).waitFor();
  }
  await page.getByText(/Three-question guided session completed/).waitFor();
  const practiceNotes=page.waitForEvent("download");
  await page.getByRole("button",{name:"Download practice notes"}).click();
  assert((await practiceNotes).suggestedFilename().endsWith(".txt"),"guided practice must export session report");
  assert((await page.locator("#main-content").innerText()).includes("NOT AI-GRADED"), "offline skill practice must be clearly ungraded");
  await page.goto(base + "/interview");
  await page.getByRole("combobox", { name: "Interview role or skill" }).fill("JavaScript");
  await page.getByRole("combobox", { name: "Interview role or skill" }).press("Escape");
  await page.getByLabel("Interview seniority").selectOption("intermediate");
  await page.getByRole("button", { name: /START GUIDED PRACTICE/i }).click();
  assert((await page.locator("#main-content").innerText()).includes("asynchronous JavaScript bug"), "intermediate interview needs appropriate first question");
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: /RECORD PRACTICE ANSWER/i }).waitFor({timeout:15000, state:"visible"});
    await page.getByPlaceholder("You can complete the whole interview without a microphone. Type your answer here.")
      .fill("I would use a concrete project example, explain reasoning and test an edge case.");
    await page.getByRole("button", { name: /RECORD PRACTICE ANSWER/i }).click();
    await page.getByText("QUESTION " + (i + 1) + " · GUIDED, NOT GRADED").waitFor();
    if (i < 2) await page.getByRole("button", { name: /NEXT QUESTION/i }).click();
  }
  await page.getByText(/3 answers were guided offline and not automatically graded/).waitFor();
  const interviewNotes=page.waitForEvent("download");
  await page.getByRole("button",{name:/Download interview notes/i}).click();
  assert((await interviewNotes).suggestedFilename().endsWith(".txt"),"interview must export answer and feedback notes");

  process.stdout.write("OK no-network guided skill review and three-question interview\\n");
  await page.goto(base + "/oracle");
  await page.getByLabel("Your current experience").selectOption("advanced");
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button",{name:/Use this learning path/i}).click();
  assert((await page.locator("#main-content").innerText()).includes("Core Web Vitals"),"advanced Oracle roadmap must have measurable role-specific deliverable");
  await page.goto(base + "/workspace");
  await page.getByLabel("Review difficulty").selectOption("intermediate");
  await page.getByRole("button",{name:/Analyse product transactions/i}).click();
  assert((await page.locator("#main-content").innerText()).includes("Group records by category"),"workspace recipe should present acceptance criteria");
  assert((await page.getByLabel("JavaScript source code editor").inputValue()).includes("totalsByCategory"),"project template should load editable starter code");
  const codeExport = page.waitForEvent("download");
  await page.getByRole("button",{name:/EXPORT CODE/i}).click();
  const savedSource = await codeExport;
  assert(savedSource.suggestedFilename().endsWith(".js"),"source export must retain JS extension");
  await page.goto(base + "/portfolio");
  await page.getByRole("button",{name:"Edit Portfolio smoke project"}).click();
  await page.getByPlaceholder("Who needed this, and what problem were you solving?").fill("Readers need a credible project explanation.");
  await page.getByPlaceholder("What approach did you take, and why? Mention one meaningful trade-off.").fill("Used a small responsive design with accessible controls.");
  await page.getByPlaceholder("What did you actually test or observe? Include limitations, not fabricated results.").fill("Checked keyboard navigation in a local browser.");
  await page.getByRole("button",{name:"Save project"}).click();
  const enhanced = await page.locator('iframe[title="Preview of your locally generated portfolio"]').getAttribute("srcdoc");
  assert(enhanced.includes("Checked keyboard navigation"),"portfolio export should contain structured evidence");
  await page.goto(base + "/interview");
  await page.getByLabel("Interview seniority").selectOption("intermediate");
  await page.getByLabel("Interview about your actual project (optional)").selectOption({label:"Portfolio smoke project"});
  await page.getByRole("combobox",{name:"Interview role or skill"}).fill("React");
  await page.getByRole("combobox",{name:"Interview role or skill"}).press("Escape");
  await page.getByRole("button",{name:/START GUIDED PRACTICE/i}).click();
  assert((await page.locator("#main-content").innerText()).includes('About your project "Portfolio smoke project"'),"guided interview must use explicitly chosen portfolio case study");
  process.stdout.write("OK difficulty calibration across five tools and structured case studies\\n");
  // Guest access remains functional while publishing requires explicit sign-in.
  await page.goto(base + "/account");
  await page.getByRole("heading",{name:"Your work stays yours."}).waitFor();
  await page.getByLabel("Email address").waitFor();
  await page.goto(base + "/portfolio");
  await page.getByRole("heading",{name:"Your portfolio on the web"}).waitFor();
  await page.getByText("Sign in to publish a page.").waitFor();
  // Public case study: simulate a published, owner-approved document without a live database.
  await page.route("**/rest/v1/portforge_publications**", route => {
    return route.fulfill({status:200, contentType:"application/json",body:JSON.stringify({
      slug:"sample-projects",theme:"editorial",published:true,updated_at:"2026-10-25T00:00:00Z",
      document:{name:"Sample Learner",headline:"Developer",bio:"I build accessible tools.",
        focus:"frontend",projects:[{title:"Keyboard-first application",summary:"I built and tested an accessible application.",
          challenge:"Keyboard navigation",approach:"Semantic HTML",validation:"Observed focus order in browser",
          technologies:"HTML, JavaScript",role:"Built interface",outcome:"Clear focus states",
          projectUrl:"https://example.com/project"}]},
    })});
  });
  await page.goto(base + "/p/sample-projects");
  await page.getByRole("heading",{name:"Keyboard-first application"}).waitFor({timeout:10000});
  assert((await page.locator("#main-content").innerText()).includes("Observed focus order in browser"),"public portfolio must show approved testing evidence");
  await page.unroute("**/rest/v1/portforge_publications**");
  process.stdout.write("OK account entry and simulated public portfolio case-study page\\n");
  assert.equal(errors.length,0,"unhandled browser errors: "+errors.join("; "));
  await context.close();
}
run().then(()=>{process.stdout.write("All browser checks passed\n");}).catch(e=>{process.stderr.write(String(e.stack||e)+"\n");process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.kill("SIGTERM");});
