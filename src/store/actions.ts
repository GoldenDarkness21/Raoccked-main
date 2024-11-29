import { Actions, Screens } from '../types/store';
import { getProducts, getCurrentUserProfile, getPostsForCurrentUser } from '../utils/firebase';

export const navigate = (screen: Screens) => {
	return {
		action: Actions.NAVIGATE,
		payload: screen,
	};
};

export const getProductsAction = async () => {
	const products = await getProducts(); //Firestore
	return {
		action: Actions.GETPRODUCTS,
		payload: products,
	};
};

export const setUserCredentials = (user: any) => {
    return {
        action: Actions.SETUSERCREDENTIALS,
        payload: user,
    }
};

export const getCurrentUserProfileAction = async () => {
	const currentStateProfile = await getCurrentUserProfile(); //Firestore
	return {
		action: Actions.GETCURRENTUSERPROFILE,
		payload: currentStateProfile,
	};
};

export const getPostsForCurrentUserAction = async () => {
	const currentUserPosts = await getPostsForCurrentUser(); //Firestore
	return {
		action: Actions.GETPOSTSFORCURRENTUSER,
		payload: currentUserPosts,
	};
};


// export const updateProfileAction = async (userData: any) => {
//     await updateProfileUser(userData);
//     return {
//         action: Actions.UPDATEPROFILEUSER,
//         payload: userData,
//     }
// }



