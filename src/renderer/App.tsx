import './App.css';

function MainPage() {
  return (
    <div className="bg-newForest relative">
      <h1 className="absolute right-4 top-4">TPG Deployment Portal</h1>
      <div className="bg-newForest flex flex-col items-center justify-center text-center">
        <h1>SLACK INTEGRATIONS TBD</h1>
        <h1>GitHub PR</h1>
        <webview
          src="https://github.com/travelpassgroup/travelpass.com/pull/4061"
          style={{
            height: '480px',
            width: '950px',
          }}
        />
        <h1>AWS BRANCHES</h1>
        <webview
          src="https://us-west-2.console.aws.amazon.com/amplify/home?region=us-west-2#/d4wcggtzkx8v6"
          style={{
            height: '250px',
            width: '950px',
          }}
        />
        <div>GITHUB ACTIONS</div>
        <webview
          src="https://github.com/travelpassgroup/travelpass.com/actions"
          style={{
            height: '480px',
            width: '950px',
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return MainPage();
}
