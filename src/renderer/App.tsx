// import { clipboard } from 'electron';
import './App.css';
import React from 'react';

const { useEffect, useRef, useState } = React;

const { sendMessage } = window.electron.ipcRenderer;

function MainPage() {
  const [showPRView, setShowPRView] = useState<boolean>(true);
  const [awsStep, setAwsStep] = useState<number>(0);
  const [prInputValue, setPrInputValue] = useState<string>('');
  const generatedMessageEl = useRef<HTMLParagraphElement>(null);

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

  const generateMessage = async () => {
    const generatedMessage = await window.electron.generateReviewMessage();
    if (generatedMessage && generatedMessageEl.current) {
      generatedMessageEl.current.textContent =
        'Review message copied to clipboard!';
    }
  };

  return (
    <div className="bg-newForest flex flex-col gap-4 py-4 px-2 relative h-[100vh]">
      {/* <div className="bg-newForest flex flex-col items-center justify-center text-center"> */}
      <div className="flex flex-row justify-between items-center">
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
      <div className="flex flex-row gap-4 items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (prInputValue.match(/[#]?[0-9]+/)) {
              sendMessage('pr-query', prInputValue);
              if (generatedMessageEl.current)
                generatedMessageEl.current.textContent = '';
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
        </form>
        <button
          className="bg-beachDark border-2 border-forest rounded-md p-1 uppercase hover:shadow-md"
          onClick={generateMessage}
          type="button"
        >
          Generate review message
        </button>
        <p className="italic" id="generated-message" ref={generatedMessageEl} />
      </div>
    </div>
    // </div>
  );
}

export default function App() {
  return MainPage();
}
