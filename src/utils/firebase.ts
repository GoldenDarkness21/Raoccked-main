// Importamos las funciones necesarias de Firebase y otras partes de la aplicación.
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getFirestore, snapshotEqual} from 'firebase/firestore';
import { uploadBytes } from 'firebase/storage';
import { appState, dispatch } from '../store';
import { navigate, setUserCredentials } from '../store/actions';
// import storage from './storage'
import { Screens } from '../types/store';

// Declaramos variables globales para la base de datos, autenticación y almacenamiento.

let db: any;
let auth: any;
let storage: any;



export interface UserProfile {
    uid: string;
    name?: string;
    postImage?: string;
    [key: string]: any; // Esto permite agregar otros campos dinámicos desde Firestore
}

// La función `getFirebaseInstance` inicializa Firebase, incluyendo base de datos, autenticación y almacenamiento.
export const getFirebaseInstance = async () => {
	if (!db) {
        //llamar base de datos
		// Si la base de datos aún no está inicializada, importamos y configuramos Firebase.


		const { getFirestore } = await import('firebase/firestore');
		const { initializeApp } = await import('firebase/app');
        //llamar autentificacion 
		const { getAuth } = await import('firebase/auth');
		const { getStorage} = await import('firebase/storage')

		const firebaseConfig = {
			apiKey: "AIzaSyCF1DeCs_1D2IF1ZZCKnNJ2DFqXjVMtwTA",
			authDomain: "racoked.firebaseapp.com",
			projectId: "racoked",
			storageBucket: "racoked.firebasestorage.app",
			messagingSenderId: "959491826969",
			appId: "1:959491826969:web:17f0bd87d65be275265188",
			measurementId: "G-LF8WX1VKPJ"
		  };
		  

		const app = initializeApp(firebaseConfig);
		db = getFirestore(app);
		auth = getAuth(app);
		storage = getStorage();

		// Configuramos un listener para los cambios en el estado de autenticación del usuario.
		onAuthStateChanged(auth, async (user) => {
			if (user) {
			 // Si el usuario está autenticado, ejecutamos este bloque.
			  console.log("Usuario autenticado:", user);
			  console.log('data in appState', appState.user);

		
			  // Obtener datos adicionales del usuario desde Firestore
			  const { doc, getDoc } = await import('firebase/firestore');
			  const userRef = doc(db, 'users', user.uid);
			  console.log ('id del user' , user.uid)
			  const userDoc = await getDoc(userRef);
			  console.log ('userDoc' , userDoc)
		
			  if (userDoc.exists()) {
				// Si el documento existe, extraemos y guardamos los datos del usuario.
				  const userData = userDoc.data();
				  localStorage.setItem('user', JSON.stringify(userData));// Guardamos datos en `localStorage`.
				  console.log("Nombre de usuario:", userData.displayName);
				  dispatch(setUserCredentials(userData))// Actualizamos el estado de la aplicación con datos del usuario.
				  console.log('user in appState', appState.user);
				  
				  dispatch(navigate(Screens.DASHBOARD))
			  }
		  } else {
			  // Usuario no está autenticado se va al login
			  console.log("No hay usuario autenticado.");
			  localStorage.removeItem('user');
			  dispatch(navigate(Screens.LOGIN)); // Navega a la pantalla de login
		  }
		  })
	}
	return { db, auth, storage };  // Retornamos las instancias de los servicios Firebase.

};

// Función para agregar una publicación (post) a la base de datos.
export const addPost = async (post: any) => {
	try { 
		const { db, auth } = await getFirebaseInstance(); // Aseguramos que Firebase esté inicializado.
		const { collection, addDoc } = await import('firebase/firestore');

		const user = auth.currentUser; // Obtenemos el usuario autenticado.
		console.log('active user', user);
		let imageUrl = null;

		if (post.image) {
			// Si el post contiene una imagen, la subimos a Firebase Storage.
			const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
			const storageRef = ref(storage, `images/${appState.user.userId}/${post.name}`);
			await uploadBytes(storageRef, post.image); // Subimos la imagen.
			imageUrl = await getDownloadURL(storageRef); // Obtenemos la URL de descarga de la imagen.
			console.log('img url', imageUrl);
		}

		// Creamos la colección `posts` en la base de datos.
		const where = collection(db, 'posts');
		const postToAdd = {
			name: post.name,
			ingredients: post.ingredients,
			preparation: post.preparation,
			categorie: post.categorie,
			time: post.time,
			difficulty: post.difficulty,
			userUid: appState.user.userId,
			userName: appState.user.displayName,
			image: imageUrl,
			likes: post.likes,
		};

		// Agregamos el post a Firestore.
		const docRef = await addDoc(where, postToAdd);
		console.log('Documento creado con ID:', docRef.id);

		// Si deseas guardar el UID en el documento mismo:
		const { updateDoc } = await import('firebase/firestore');
		await updateDoc(docRef, { uid: docRef.id });
		console.log('UID añadido al documento:', docRef.id);

	} catch (error) {
		console.error('Error adding document', error);
	}
};


// Función para obtener publicaciones desde la base de datos.
export const getProducts = async () => {
	try {
		const { db } = await getFirebaseInstance();
		const { collection, getDocs } = await import('firebase/firestore');

		const where = collection(db, 'posts');
		const querySnapshot = await getDocs(where);// Obtenemos todos los documentos en la colección `posts`.
		const data: any[] = [];

		querySnapshot.forEach((doc) => {
			data.push(doc.data());
		});

		return data;
	} catch (error) {
		console.error('Error getting documents', error);
	}
};

export const registerUser = async (credentials: any) => {
	try {
		const { auth, db } = await getFirebaseInstance();
		const { createUserWithEmailAndPassword } = await import('firebase/auth');
		const { doc, setDoc } = await import('firebase/firestore');

		const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
		await updateProfile(auth.currentUser, {
			displayName: credentials.name
		})

		const where = doc(db, 'users', userCredential.user.uid);
		const data = {
			email: credentials.email ?? null,
			displayName: credentials.name,
			userId: userCredential.user.uid
		};

		await setDoc(where, data);
		
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const loginUser = async (email: string, password: string) => {
	try {
		const { auth } = await getFirebaseInstance();
		console.log('auth', auth);
		
		const { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } = await import('firebase/auth');

		// Configurar la persistencia en el almacenamiento local
		await setPersistence(auth, browserLocalPersistence);

		// Iniciar sesión con el correo y contraseña
		signInWithEmailAndPassword(auth, email, password);

		// Obtener y almacenar el nombre de usuario
        const { doc, getDoc } = await import('firebase/firestore');
        const userRef = doc(db, 'users', appState.user.userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            localStorage.setItem('user', JSON.stringify(userData));
            console.log("Nombre de usuario:", userData.username);
        }
        
        dispatch(navigate(Screens.DASHBOARD));

	} catch (error: any) {
		// Manejar errores de autenticación
		console.error("Error en la autenticación:", error.code, error.message);
		throw error; // Lanza el error para que se maneje en niveles superiores si se necesita
	}
};


export const logOut = async () => {
	const { auth } = await getFirebaseInstance();
	const { signOut } = await import('firebase/auth');
  
	try {
	  await signOut(auth); 
	  console.log("Usuario deslogueado exitosamente");
	} catch (error) {
	  console.error("Error al cerrar sesión:", error);
	}
  }


export const getCurrentUserName = () => {
	const user = JSON.parse(localStorage.getItem('user') || '{}');
	return user?.name || null
} 

//aqui voy a hacer lo de los likes
//le estoy diciendo que va a recibir un parametro que va a recibir que es el posid que es cualquier cosa
export const addLikeUser = async (postId: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc, arrayUnion, getDoc } = await import('firebase/firestore');

        const userId = appState.user.userId;
        console.log("Current userId:", userId);

        if (!userId) {
            throw new Error("No user ID found in appState");
        }

        // Reference to the specific document in discover collection
        const postRef = doc(db, 'posts', postId);
        
        // Get current document data to verify it exists
        const docSnap = await getDoc(postRef);
        if (!docSnap.exists()) {
            throw new Error("post document doesn't exist");
        }

        // Update the usersid array with the new userId
        await updateDoc(postRef, {
            likes: arrayUnion(userId)
        });

        console.log("User like added to post successfully", userId);
        return true;

    } catch (error) {
        console.error("Error in addLikeUser:", error);
        throw error;
    }
};

export const removeLikeUser = async (postId: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc, arrayRemove, getDoc } = await import('firebase/firestore');

        const userId = appState.user.userId; // Obtenemos el ID del usuario actual
        console.log("Current userId:", userId);

        if (!userId) {
            throw new Error("No user ID found in appState");
        }

        // Referencia al documento específico del post
        const postRef = doc(db, 'posts', postId);
        
        // Obtenemos el documento actual para verificar que existe
        const docSnap = await getDoc(postRef);
        if (!docSnap.exists()) {
            throw new Error(`Post with ID ${postId} does not exist`);
        }

        // Eliminamos el ID del usuario del campo likes usando arrayRemove
        await updateDoc(postRef, {
            likes: arrayRemove(userId),
        });

        console.log(`User ${userId} like removed from post ${postId}`);
    } catch (error) {
        console.error("Error removing like:");
        throw error; // Relanzamos el error para manejarlo en otro lugar si es necesario
    }
};

export const upLoadFile = async (file: File, id: string) => {
	const {storage} = await getFirebaseInstance();
	const {ref} = await import ('firebase/storage');

	const storageRef = ref(storage, 'imagesProfile/' + id);
	uploadBytes(storageRef, file).then((snapshot)=> {
		console.log('file uploaded');
	})

}


export const getFile = async (id: string) => {
	const {storage} = await getFirebaseInstance();
	const {ref, getDownloadURL} = await import ('firebase/storage');
	const storageRef = ref(storage, 'imagesProfile/' + id);
	const urlImg= await getDownloadURL(ref(storageRef)).then ((url) => {
		return url;
	}).catch((error) => {
		console.error(error);
	});
	return urlImg;
}





export const getCurrentUserProfile = async (): Promise<UserProfile> => {
    try {
        const { auth, db } = await getFirebaseInstance();
        const { onAuthStateChanged } = await import('firebase/auth');
        const { doc, getDoc } = await import('firebase/firestore');

        return new Promise<UserProfile>((resolve, reject) => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // Obtener información del usuario desde Firestore
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData: UserProfile = {
                            uid: user.uid,
                            email: user.email,
                            ...userDoc.data(),
                        };
                        console.log('Usuario autenticado:', userData);
                        resolve(userData);
                    } else {
                        console.error('No se encontró el perfil del usuario en Firestore');
                        reject('Perfil no encontrado');
                    }
                } else {
                    console.log('No hay usuario autenticado');
                    reject('Usuario no autenticado');
                }
            });
        });
    } catch (error) {
        console.error('Error obteniendo el usuario actual:', error);
        throw error;
    }
};

export const getPostsForCurrentUser = async () => {
    try {
        const { auth, db } = await getFirebaseInstance();
        const { onAuthStateChanged } = await import('firebase/auth');
        const { collection, query, where, getDocs } = await import('firebase/firestore');

        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // Filtrar los posts por el UID del usuario autenticado
                    const postsCollection = collection(db, 'posts');
                    const userPostsQuery = query(postsCollection, where('userUid', '==', user.uid));
                    const querySnapshot = await getDocs(userPostsQuery);

                    const userPosts: any[] = [];
                    querySnapshot.forEach((doc) => {
                        userPosts.push({ id: doc.id, ...doc.data() });
                    });

                    console.log('Posts del usuario:', userPosts);
                    resolve(userPosts);
                } else {
                    console.log('No hay usuario autenticado');
                    reject('Usuario no autenticado');
                }
            });
        });
    } catch (error) {
        console.error('Error obteniendo los posts del usuario:', error);
        throw error;
    }
};


export async function updateUserData(userId: string, updatedName: string) {
	try {
	  const { db } = await getFirebaseInstance();
	  const { doc, updateDoc } = await import('firebase/firestore');
	  const userRef = doc(db, 'users', userId);
	  
	  // Asegurarse de que el valor no sea undefined o vacío
	  if (updatedName) {
		// Actualizamos el campo "name" en la base de datos
		await updateDoc(userRef, {
		  displayName: updatedName,
		});
	  } else {
		console.error('El nombre no puede estar vacío.');
	  }
	} catch (error) {
	  console.error(error);
	}
  }
  
  


  export const NewgetProducts = async () => {
	try {
		const { db } = await getFirebaseInstance();
		const { collection, getDocs } = await import('firebase/firestore');

		const where = collection(db, 'products');
		const querySnapshot = await getDocs(where);
		const data: any[] = [];

		querySnapshot.forEach((doc) => {
			data.push(doc.data());
		});

		return data;
	} catch (error) {
		console.error('Error getting documents', error);
	}
};
