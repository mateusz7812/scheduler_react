import Config from "./Config";

export const msalConfig = {
    auth: {
      clientId: Config.msal_client_id, //"232cc6c8-2cba-4057-bd14-ee462bfe2dd1",
      authority: Config.msal_authority, //"https://login.microsoftonline.com/7ff229c8-8063-4d45-a70f-1ad03cfbb293", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
      redirectUri: Config.msal_redirect_url //"http://localhost:3006/login",
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
   scopes: ["User.Read"]
  };
  
  // Add the endpoints here for Microsoft Graph API services you'd like to use.
  export const graphConfig = {
      graphMeEndpoint: "https://graph.microsoft.com"
  };