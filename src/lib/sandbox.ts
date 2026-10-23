/**
 * Runs browser JavaScript in a sandboxed, opaque-origin iframe.
 * Never execute learner code in the application origin or directly via new Function().
 * This is for educational, CPU-bounded JS examples, NOT production multi-language compute.
 */
export function runIsolatedJavaScript(source: string, timeoutMs = 2500): Promise<string[]> {
  if (source.length > 30000) return Promise.reject(new Error("Code is too large (30 KB maximum)."));
  return new Promise((resolve,reject) => {
    const token = crypto.randomUUID();
    const frame = document.createElement("iframe");
    frame.setAttribute("sandbox","allow-scripts");
    frame.setAttribute("title","Isolated JavaScript exercise runner");
    frame.setAttribute("aria-hidden","true");
    frame.setAttribute("referrerpolicy","no-referrer");
    frame.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;opacity:0;pointer-events:none";
    let finished = false;
    let timeoutId: number;
    const clean = () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("message",onMessage);
      frame.remove();
    };
    const finish = (error?:Error, logs?:string[]) => {
      if(finished) return;
      finished=true;
      clean();
      if(error) reject(error); else resolve(logs||[]);
    };
    const onMessage = (event:MessageEvent) => {
      if(event.source !== frame.contentWindow || event.origin !== "null") return;
      const m = event.data;
      if(!m || m.kind!=="portforge:result" || m.token!==token) return;
      if(!Array.isArray(m.logs)) return finish(new Error("Invalid sandbox response"));
      finish(undefined,m.logs.slice(0,100).map((x:unknown)=>String(x).slice(0,600)));
    };
    // A sandboxed srcdoc iframe without allow-same-origin gets an opaque origin.
    // CSP prevents network, form, worker, iframe, and external resource access.
    const runner = [
      "window.addEventListener('message',function(ev){",
      "if(ev.source!==window.parent||!ev.data||ev.data.kind!=='portforge:run')return;",
      "var msg=ev.data, logs=[],limit=100;",
      "var format=function(x){try{return typeof x==='string'?x:JSON.stringify(x);}catch(e){return String(x);}};",
      "var capture=function(){if(logs.length<limit)logs.push(Array.from(arguments).map(format).join(' ').slice(0,600));};",
      "console.log=capture;console.info=capture;console.warn=capture;console.error=capture;",
      "try{ if(typeof msg.source!=='string'||msg.source.length>30000)throw Error('Invalid code');",
      "new Function(msg.source)();if(!logs.length)logs.push('[OK] Code completed with no output.');",
      "}catch(e){logs.push('[ERROR] '+String(e&&e.message||e));}",
      "window.parent.postMessage({kind:'portforge:result',token:msg.token,logs:logs},'*');",
      "});"
    ].join("");
    const csp = "default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; connect-src 'none'; worker-src 'none'; child-src 'none'; form-action 'none'; base-uri 'none'; img-src 'none'; media-src 'none'; style-src 'none'";
    frame.srcdoc = '<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="'+csp+'"></head><body><script>'+runner+'</script></body></html>';
    window.addEventListener("message",onMessage);
    timeoutId=window.setTimeout(()=>finish(new Error("Execution stopped after 2.5 seconds. Check for an infinite loop.")),timeoutMs);
    frame.addEventListener("load",()=>{
      if(finished) return;
      frame.contentWindow?.postMessage({kind:"portforge:run",token,source},"*");
    },{once:true});
    document.body.appendChild(frame);
  });
}
