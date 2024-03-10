import './App.css';
import { useState } from 'react';

function MainPage() {
  const [showPRView, setShowPRView] = useState<boolean>(true);
  const githubPR = document.getElementById('github-pull-request');
  const PRText = 'Enable auto-merge';

  // @ts-expect-error
  githubPR?.findInPage(PRText);

  githubPR?.addEventListener('found-in-page', () => {
    // @ts-expect-error
    githubPR?.stopFindInPage('keepSelection');
  });

  return (
    <div className="bg-newForest relative">
      <h1 className="absolute right-4 top-4">TPG Deployment Portal</h1>
      <div className="bg-newForest flex flex-col items-center justify-center text-center">
        <h1>SLACK INTEGRATIONS TBD</h1>
        <section className="space-y-2">
          <button
            className="bg-beachDark border-2 border-forest rounded-md p-1 uppercase hover:shadow-sm hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              setShowPRView(!showPRView);
            }}
            type="button"
          >
            Show/Hide Pull Request
          </button>
          <webview
            className={`h-[480px] w-[950px] github-pull-request ${
              !showPRView && 'hidden'
            }`}
            id="github-pull-request"
            src="https://github.com/travelpassgroup/travelpass.com/pull/4061"
          />
        </section>

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
