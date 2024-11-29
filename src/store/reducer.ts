import { Actions } from '../types/store';

export const reducer = (currentAction: any, currentState: any) => {
	const { action, payload } = currentAction;

	switch (action) {
		case Actions.NAVIGATE:
			return {
				...currentState,
				screen: payload,
			};

		case Actions.GETPRODUCTS:
			return {
				...currentState,
				posts: payload,
			};

        
        case Actions.SETUSERCREDENTIALS:
			return {
				...currentState,
				user: payload,
			};

		case Actions.SAVELIKES:
			return {
				...currentState,
				posts: payload,
			};
			
		case Actions.GETCURRENTUSERPROFILE:
			return {
				...currentState,
				posts: payload,
			};

		case Actions.GETPOSTSFORCURRENTUSER:
		return {
			...currentState,
			posts: payload,
		};

		// case Actions.UPDATEPROFILEUSER:
		// 	return {
		// 		...currentState,
		// 		userData: currentState.userData.uid === payload.uid ? payload : currentState.userData,
		// 	};

		default:
			return currentState;
	}
};