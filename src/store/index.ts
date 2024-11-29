import { reducer } from './reducer';
import Storage from '../utils/storage';
import { AppState, Observer } from '../types/store';
//este metodo determina cuando la autentificacion cambio, es decir alguien cierra sesion y alguien mas ingresa
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseInstance } from '../utils/firebase';
import { Screens } from '../types/navegation';
import { navigate, setUserCredentials } from './actions';


//El estado global, appState
const initialState: AppState = {
	screen: 'LOGIN',
	posts: [],
  	user: {
    displayName: "",
    email: "",
    userId: ""
  },
  	selectedUserId: "",
};


//ahora el local y el session storage van a estar a cargo del firebase
export let appState = initialState;

let observers: Observer[] = [];



//Crear el dispatch
export const dispatch = (action: any) => {
	const clone = JSON.parse(JSON.stringify(appState));
	const newState = reducer(action, clone);
	appState = newState;

	// persistStore(newState);
	observers.forEach((o: any) => o.render());
};

//Agregar los observadores para los interesados, los suscritos
export const addObserver = (ref: any) => {
	observers = [...observers, ref];
};