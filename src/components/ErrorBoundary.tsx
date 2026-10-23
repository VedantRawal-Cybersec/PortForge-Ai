import { Component, type ErrorInfo, type ReactNode } from "react";
type Props = { children:ReactNode };
type State = { crashed:boolean };
export default class ErrorBoundary extends Component<Props,State> {
 state:State={crashed:false};
 static getDerivedStateFromError():State{return {crashed:true};}
 componentDidCatch(error:Error,info:ErrorInfo){
  // Do not log user answers, code or personal inputs.
  console.error("Page rendering error",error.name,info.componentStack?.split("\n")[0]||"");
 }
 render(){
  if(this.state.crashed)return <main className="max-w-2xl mx-auto px-6 py-24 text-center space-y-5" role="alert">
    <h1 className="text-3xl font-bold">Something went wrong loading this page.</h1>
    <p className="text-muted-foreground">Your locally saved progress is unchanged. Reload this page to try again.</p>
    <div className="flex flex-wrap justify-center gap-3">
      <button type="button" onClick={()=>window.location.reload()} className="rounded-lg bg-foreground text-background px-5 py-3 font-semibold">Reload page</button>
      <a className="rounded-lg border border-border px-5 py-3" href="/">Go home</a>
    </div>
  </main>;
  return this.props.children;
 }
}
