export default function AWS() {
  return (
    <>
      <h1>AWS BRANCHES</h1>
      <section
        className="text-center flex flex-col gap-4 h-[600px] items-center justify-evenly px-4 w-full"
        id="deploy-branch"
      >
        <webview
          className="h-full w-full"
          id="okta-login"
          src="https://travelpassgroup.okta.com/app/UserHome"
        />
        {/* {awsStep === 0 && (
          <webview
            className="h-full w-full"
            id="okta-login"
            src="https://travelpassgroup.okta.com/app/UserHome"
          />
        )} */}
        {/* {awsStep === 1 && (
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
        )} */}
        {/* <div className="flex flex-row gap-4">
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
        </div> */}
      </section>
    </>
  );
}
