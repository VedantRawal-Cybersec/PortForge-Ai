const fs = require("node:fs");
const path = require("node:path");
// Fail CI if owner-specific promotional material is reintroduced as site-wide content.
const roots=["src/pages","src/components"];
const files=["index.html"];
for (const root of roots) {
  function visit(dir) {
    for(const item of fs.readdirSync(dir,{withFileTypes:true})) {
      const filename=path.join(dir,item.name);
      if(item.isDirectory()) visit(filename);
      else if(/\.(tsx?|jsx?|html)$/i.test(item.name)) files.push(filename);
    }
  }
  visit(root);
}
const blocked=[
  ["owner identity",/\b(?:Vedant\s+Rawal|VedantRawal|VedantRawal-Cybersec)\b/i],
  ["owner social profile",/linkedin\.com\/in\/vedant-rawal/i],
  ["owner's projects",/\b(?:Sentinel AI Web Security Scanner|Threat Forge XSS Scanner|IMMUNEFIN AI|Daily Cyber Briefing Workflow)\b/i],
  ["cybersecurity showcase",/\bLive cybersecurity project panel\b/i],
  ["personal proof feed",/\bConnected Proof Feed\b/i]
];
const errors=[];
for(const file of files) {
  const content=fs.readFileSync(file,"utf8");
  for(const [label,pattern] of blocked) {
    if(pattern.test(content)) errors.push(file+": "+label);
  }
}
if(errors.length) {
  console.error("PortForge commercial-neutrality check failed:\n"+errors.join("\n"));
  process.exitCode=1;
} else console.log("PortForge neutrality check passed: "+files.length+" files");
