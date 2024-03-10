import './App.css';
import { useEffect, useState } from 'react';

function MainPage() {
  const [showPRView, setShowPRView] = useState<boolean>(true);
  const [awsStep, setAwsStep] = useState<number>(0);

  useEffect(() => {
    if (awsStep === 2) {
      const awsConsole = document.getElementById('aws-console');
      const masterBtn = document.getElementById('master-btn');
      const stgBtn = document.getElementById('stg-btn');
      const prodBtn = document.getElementById('prod-btn');

      masterBtn?.addEventListener('click', () => {
        // @ts-expect-error
        awsConsole?.findInPage('https://int.travelpass.com');
      });
      stgBtn?.addEventListener('click', () => {
        // @ts-expect-error
        awsConsole?.findInPage('https://stg.travelpass.com');
      });
      prodBtn?.addEventListener('click', () => {
        // @ts-expect-error
        awsConsole?.findInPage('https://travelpass.com');
      });
      awsConsole?.addEventListener('found-in-page', () => {
        // @ts-expect-error
        awsConsole?.stopFindInPage('clearSelection');
      });
    }
  }, [awsStep]);

  return (
    <div className="bg-newForest relative">
      <div className="bg-newForest flex flex-col items-center justify-center text-center">
        <h1>SLACK INTEGRATIONS TBD</h1>
        <section className="space-y-2">
          <button
            className="bg-beachDark border-2 border-forest rounded-md p-1 uppercase hover:shadow-md"
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
        {/* TODO: make it click 'AWS Amplify' and then 'travelpass.com' automatically on step 2 */}
        <section
          className="text-center flex flex-col gap-4 h-[600px] items-center justify-evenly px-4 w-full"
          id="deploy-branch"
        >
          {awsStep === 0 && (
            <webview
              className="h-full w-full"
              id="okta-login"
              src="https://travelpassgroup.okta.com/app/UserHome"
            />
          )}
          {awsStep === 1 && (
            <webview
              className="h-full w-full"
              id="role-selection"
              src="https://d-9267487623.awsapps.com/start#/"
            />
          )}
          {awsStep === 2 && (
            <webview
              className="h-full w-full"
              id="aws-console"
              src="https://d-9267487623.awsapps.com/start/#/saml/custom/361429333791%20%28TravelPass%20Group%20Production%29/MDQ3OTE0ODUzNzA4X2lucy1hZjdkZmMxZDk2MWI4NzhlX3AtM2FlZTA3Zjk5NGRjOWEyMg%3D%3D"
            />
          )}
          <div className="flex flex-row gap-4">
            {awsStep > 0 && (
              <button
                className={`bg-beachDark border-2 border-forest h-[96px] rounded-md p-1 uppercase hover:shadow-md ${
                  awsStep === 1 ? 'w-1/2' : 'w-full'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setAwsStep(awsStep > 0 ? awsStep - 1 : awsStep);
                }}
                type="button"
              >
                {'<--- Previous Step'}
              </button>
            )}
            {awsStep < 2 && (
              <button
                className={`bg-beachDark border-2 border-forest h-[96px] rounded-md p-1 uppercase hover:shadow-md ${
                  awsStep === 1 ? 'w-1/2' : 'w-full'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setAwsStep(awsStep < 3 ? awsStep + 1 : awsStep);
                }}
                type="button"
              >
                {'Next Step --->'}
              </button>
            )}
            {awsStep === 2 && (
              <div className="flex flex-row gap-2">
                <button
                  className="bg-beachDark border-2 border-forest h-[96px] rounded-md p-1 hover:shadow-md"
                  id="master-btn"
                  type="button"
                >
                  Check master
                </button>
                <button
                  className="bg-beachDark border-2 border-forest h-[96px] rounded-md p-1 hover:shadow-md"
                  id="stg-btn"
                  type="button"
                >
                  Check stg
                </button>
                <button
                  className="bg-beachDark border-2 border-forest h-[96px] rounded-md p-1 hover:shadow-md"
                  id="prod-btn"
                  type="button"
                >
                  Check prod
                </button>
              </div>
            )}
          </div>
        </section>
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
