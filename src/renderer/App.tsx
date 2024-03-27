// import { clipboard } from 'electron';
import './App.css';
import { useEffect, useState } from 'react';

const { sendMessage } = window.electron.ipcRenderer;

function MainPage() {
  const [showPRView, setShowPRView] = useState<boolean>(true);
  const [awsStep, setAwsStep] = useState<number>(0);
  const [prInputValue, setPrInputValue] = useState<string>('');
  const [prQuery, setPrQuery] = useState<string>(
    'https://github.com/travelpassgroup/travelpass.com',
  );

  // TODO: figure out how to set zoom!!!
  const githubPr = document.querySelector('.github-pull-request');
  githubPr?.addEventListener('dom-ready', () => {
    // @ts-expect-error
    githubPr?.setZoomFactor(3.0);
    // @ts-expect-error
    githubPr?.setZoomLevel(-2);
  });

  // const engFrontendReviewsUrl =
  //   'https://app.slack.com/client/T044VSX8U/C039QHRA6TA';
  // const changeTrackerUrl = 'https://app.slack.com/client/T044VSX8U/C26604VST';

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
    <div className="bg-newForest flex flex-col justify-center relative h-[100vh]">
      {/* <div className="bg-newForest flex flex-col items-center justify-center text-center"> */}
      <div className="flex flex-row justify-between items-center">
        {/* <form
              className={`${!showPRView ? 'hidden' : ''}`}
              onSubmit={(e) => {
                e.preventDefault();
                if (prInputValue.match(/[#]?[0-9]+/)) {
                  sendMessage('pr-query', prQuery);
                  setPrQuery(
                    `https://github.com/travelpassgroup/travelpass.com/pull/${prInputValue}`,
                  );
                }
              }}
            >
              <label htmlFor="pr-number">
                PR number:
                <input
                  className="bg-canyonLight border-2 border-forest ml-2 rounded-md"
                  name="pr-number"
                  value={prInputValue}
                  onChange={(e) => {
                    setPrInputValue(e.target.value);
                  }}
                />
              </label>
            </form> */}
        <button
          className="bg-beachDark border-2 border-forest rounded-md p-1 uppercase hover:shadow-md"
          onClick={(e) => {
            e.preventDefault();
            sendMessage('toggle-gh-windows', !showPRView);
            setShowPRView(!showPRView);
          }}
          type="button"
        >
          Show/Hide GitHub
        </button>
        <section className="inline-flex flex-row gap-4">
          <button
            className={`bg-beachDark border-2 border-forest max-h-1/2 rounded-md p-1 uppercase hover:shadow-md ${
              awsStep > 0 ? 'visible' : 'invisible'
            }`}
            onClick={(e) => {
              e.preventDefault();
              sendMessage('set-aws-step', awsStep - 1);
              setAwsStep(awsStep > 0 ? awsStep - 1 : awsStep);
            }}
            type="button"
          >
            {'<--- AWS'}
          </button>
          <button
            className={`bg-beachDark border-2 border-forest max-h-1/2 rounded-md p-1 uppercase hover:shadow-md ${
              awsStep < 2 ? 'visible' : 'invisible'
            }`}
            onClick={(e) => {
              e.preventDefault();
              sendMessage('set-aws-step', awsStep + 1);
              setAwsStep(awsStep < 3 ? awsStep + 1 : awsStep);
            }}
            type="button"
          >
            {'AWS --->'}
          </button>
        </section>
        <div className="flex flex-row gap-2">
          <button
            className={`${
              awsStep === 2 ? 'visible' : 'invisible'
            } bg-beachDark border-2 border-forest rounded-md p-1 hover:shadow-md`}
            disabled={awsStep !== 2}
            id="master-btn"
            type="button"
            onClick={() => {
              sendMessage('check-branch', 'master');
            }}
          >
            master
          </button>
          <button
            className={`${
              awsStep === 2 ? 'visible' : 'invisible'
            } bg-beachDark border-2 border-forest rounded-md p-1 hover:shadow-md`}
            disabled={awsStep !== 2}
            id="stg-btn"
            type="button"
            onClick={() => {
              sendMessage('check-branch', 'stg');
            }}
          >
            stg
          </button>
          <button
            className={`${
              awsStep === 2 ? 'visible' : 'invisible'
            } bg-beachDark border-2 border-forest rounded-md p-1 hover:shadow-md`}
            disabled={awsStep !== 2}
            id="prod-btn"
            type="button"
            onClick={() => {
              sendMessage('check-branch', 'prod');
            }}
          >
            prod
          </button>
        </div>
      </div>

      {/* <webview
            className={`h-[480px] w-[950px] github-pull-request ${
              !showPRView && 'hidden'
            }`}
            id="github-pull-request"
            src={prQuery}
          /> */}

      {/* <h1>AWS BRANCHES</h1>
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
        <section className="flex flex-row">
          <div>
            <button
              className="bg-beachDark border-2 border-forest rounded-md p-1 uppercase hover:shadow-md"
              onClick={() => {
                const slackChangeTracker = document.getElementById(
                  'slack-change-tracker',
                );
                slackChangeTracker?.focus();
                // @ts-expect-error
                slackChangeTracker?.insertText('Deploying ');
                // @ts-expect-error
                slackChangeTracker?.insertText('`');
                // @ts-expect-error
                slackChangeTracker?.insertText('travelpass.com');
                // @ts-expect-error
                slackChangeTracker?.insertText('`');
                // @ts-expect-error
                slackChangeTracker?.insertText(' to ');
                // @ts-expect-error
                slackChangeTracker?.insertText('`');
                // @ts-expect-error
                slackChangeTracker?.insertText('INT');
                // @ts-expect-error
                slackChangeTracker?.insertText('`');
              }}
              type="button"
            >
              Post to change_tracker
            </button>
            <webview
              className="h-[480px] w-[475px]"
              id="slack-change-tracker"
              src={changeTrackerUrl}
            />
          </div>
          <div>
            <button
              className="bg-beachDark border-2 border-forest rounded-md p-1 uppercase hover:shadow-md"
              onClick={() => {
                const slackChangeTracker = document.getElementById(
                  'slack-eng-frontend-reviews',
                );
                slackChangeTracker?.focus();
                // @ts-expect-error
                slackChangeTracker?.insertText(prQuery);
              }}
              type="button"
            >
              Post to eng-frontend-reviews
            </button>
            <webview
              className="h-[480px] w-[475px]"
              id="slack-eng-frontend-reviews"
              src={engFrontendReviewsUrl}
            />
          </div>
        </section> */}
    </div>
    // </div>
  );
}

export default function App() {
  return MainPage();
}
