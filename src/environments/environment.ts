// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
	production: false,
	MAX_CERTIFICATE_FILE_SIZE: 1048576,
	MAX_APK_FILE_SIZE: 20 * 1024 * 1024,
	REFRESH_INTERVAL_BATCH_OPERATION_CODE_AND_SERVER_DATE: 30 * 1000,
	REFRESH_INTERVAL_BATCH_CODE: 30 * 1000,
	REFRESH_INTERVAL_MAP: 30 * 1000,
	API_URL: '',
  UCOM_URL: 'http://localhost:8090/',
	INTERVAL_AUTOMATION_EXECUTE_TAG: 5 * 1000
};
