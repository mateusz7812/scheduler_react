const envSettings = window;

export default class Config {
  static graphql_address = envSettings.GRAPHQL_ADDRESS;
  static msal_client_id = envSettings.MSAL_CLIENT_ID;
  static msal_redirect_url = envSettings.MSAL_REDIRECT_URL;
  static msal_authority = envSettings.MSAL_AUTHORITY;
  static port_no = envSettings.PORT_NO;
  static host_no = envSettings.HOST_NO;
}