import './App.css';
import { useState } from 'react';

function MainPage() {
  const [showPRView, setShowPRView] = useState<boolean>(true);
  const [awsStep, setAwsStep] = useState<number>(0);
  const deploymentMonitor = document.getElementById('deployment-monitor');
  const githubPR = document.getElementById('github-pull-request');
  const PRText = 'Enable auto-merge';

  console.log('current step: ', awsStep);

  deploymentMonitor?.addEventListener('will-frame-navigate', () => {
    setAwsStep(awsStep + 1);
  });

  // // @ts-expect-error
  // githubPR?.findInPage(PRText);

  // githubPR?.addEventListener('found-in-page', () => {
  //   // @ts-expect-error
  //   githubPR?.stopFindInPage('keepSelection');
  // });

  return (
    <div className="bg-newForest relative">
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
          className="h-[480px] w-full"
          partition="persist:aws"
          src="https://travelpassgroup.okta.com/app/UserHome"
        />
        <webview
          className="h-[480px] w-full"
          partition="persist:aws"
          src="https://d-9267487623.awsapps.com/start#/"
        />
        <webview
          className="h-[480px] w-full"
          partition="persist:aws"
          src="https://d-9267487623.awsapps.com/start/#/saml/custom/361429333791%20%28TravelPass%20Group%20Production%29/MDQ3OTE0ODUzNzA4X2lucy1hZjdkZmMxZDk2MWI4NzhlX3AtM2FlZTA3Zjk5NGRjOWEyMg%3D%3D"
        />
        <div>GITHUB ACTIONS</div>
        <webview
          className="h-[480px] w-[950px]"
          src="https://github.com/travelpassgroup/travelpass.com/actions"
        />
      </div>
    </div>
  );
}

export default function App() {
  return MainPage();
}
