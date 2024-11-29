export type Observer = { render: () => void } & HTMLElement;

export type AppState = {
	screen: string;
	posts: [];
    user: {
    displayName: string,
    email: string,
    userId: string
    },
    selectedUserId: string, 
};

export enum Screens {
    REGISTER = "REGISTER",
    LOGIN = "LOGIN",
    DASHBOARD = "DASHBOARD",
    POST = "POST",
    CREATEPOST = "CREATEPOST",
    FAVORITES = "FAVORITES",
    PROFILE = "PROFILE",
    SETTINGS = "SETTINGS",
}

export enum Actions {
	'NAVIGATE' = 'NAVIGATE',
	'GETPRODUCTS' = 'GETPRODUCTS',
    'SETUSERCREDENTIALS' = 'SETUSERCREDENTIALS',
    'SAVELIKES' = 'SAVELIKES',
    'GETCURRENTUSERPROFILE' = 'GETCURRENTUSERPROFILE',
    'GETPOSTSFORCURRENTUSER' = 'GETPOSTSFORCURRENTUSER',
    'UPDATEPROFILEUSER' = 'UPDATEPROFILEUSER'

    }