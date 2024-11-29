import { Post } from "../../types/post";
import { addPost,  } from "../../utils/firebase";
import { addObserver, appState, dispatch } from "../../store";
 import { getProductsAction, navigate } from "../../store/actions";
import UserSidebar, { SidebarAttribute, } from "../../components/left-bar/left-bar";
import BottomNavbar, { NavbarAttribute } from '../../components/bottomBar/BottomNavbar';
import { Screens } from "../../types/store";


const post: Post = {
  name: "",
  ingredients: "",
  preparation: "",
  categorie: "",
  time: "",
  difficulty: "",
  image: "",
  likes: {},
};

class Createpost extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    this.shadowRoot?.appendChild(style);
    addObserver(this);
  }

  async connectedCallback() {

    this.render();
	
  }

  
	// Métodos para actualizar los campos de `post` según el valor ingresado en el formulario.
  changeName(e: any) {
    post.name = e.target.value;
  }

  changeIngredients(e: any) {
    post.ingredients = e.target.value;
	console.log(e.target.value);
	
  }

  changePreparation(e: any) {
    post.preparation = e.target.value;
  }

  changeCategorie(e: any) {
    post.categorie = e.target.value;
	console.log(post.categorie)
  }

  changeTime(e: any) {
    post.time = e.target.value;
  }

  changeFile(e: any) {
    post.image = e.target.files?.[0];// Guarda el archivo de imagen seleccionado
	console.log('img in form', post.image); // Imprime la imagen en la consola para depuración
	
  }

  changeDifficulty(e: any) {
    post.difficulty = e.target.value;
	console.log(post.difficulty)
  }



  submitForm() {
	console.log(post)
    addPost(post);// Imprime la imagen en la consola para depuración
	console.log('post added in create post');
	
	dispatch(navigate(Screens.DASHBOARD))// Navega al dashboard después de agregar el post.
	console.log(appState.user);
	
  }

  async render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../src/screens/5createpost/createpost.css">
				<div id="sidebar">
					<user-sidebar ${SidebarAttribute.profilePicture}></user-sidebar>
				</div>
        <bottom-navbar ${NavbarAttribute.activeIcon}="home"></bottom-navbar>

			`;

      const section1 = this.ownerDocument.createElement("section");
      section1.classList.add("principal-section");
      const section2 = this.ownerDocument.createElement("section");
      section2.classList.add("image-section");
      const section3 = this.ownerDocument.createElement("section");
      section3.classList.add("form-section");
      const section4 = this.ownerDocument.createElement("section");
      section4.classList.add("category-section");
      const section5 = this.ownerDocument.createElement("section");
      section5.classList.add("main-section");

      // Título del formulario
      const title = this.ownerDocument.createElement("h1");
      title.innerText = "New Post!";
      section3.appendChild(title);
      title.classList.add("title");


	  //campo de la imagen
      const pImage = this.ownerDocument.createElement("input");
	  pImage.type = 'file';
      pImage.addEventListener('change', this.changeFile);
      section2.appendChild(pImage);
      pImage.classList.add("image");
	  const postImg = this.ownerDocument.createElement('img');
	  section2.appendChild(postImg)


      //campo del nombre
      const nameLabel = this.ownerDocument.createElement("label");
      nameLabel.innerText = "Recipe name";
      nameLabel.htmlFor = "recipe name";
      section3.appendChild(nameLabel);
      nameLabel.classList.add("label");

      const pName = this.ownerDocument.createElement("input");
      pName.addEventListener("change", this.changeName);
      section3.appendChild(pName);
      pName.classList.add("name");


      //campo de los ingredientes
      const ingredientsLabel = this.ownerDocument.createElement("label");
      ingredientsLabel.innerText = "Ingredients";
      ingredientsLabel.htmlFor = "ingredients";
      section3.appendChild(ingredientsLabel);
      ingredientsLabel.classList.add("label");

      const pIngredients = this.ownerDocument.createElement("input");
      pIngredients.addEventListener("change", this.changeIngredients);
      section3.appendChild(pIngredients);
      pIngredients.classList.add("ingredients");


      //campo de preparation
      const preparationLabel = this.ownerDocument.createElement("label");
      preparationLabel.innerText = "Preparation";
      preparationLabel.htmlFor = "preparation";
      section3.appendChild(preparationLabel);
      preparationLabel.classList.add("label");

      const pPreparation = this.ownerDocument.createElement("input");
      pPreparation.addEventListener("change", this.changePreparation);
      section3.appendChild(pPreparation);
      pPreparation.classList.add("preparation");


      // Contenedor para la categoría
      const categoryContainer = this.ownerDocument.createElement("div");

      // Etiqueta para el campo de categoría
      const categoryLabel = this.ownerDocument.createElement("label");
      categoryLabel.innerText = "Category";
      categoryLabel.htmlFor = "category";
      categoryContainer.appendChild(categoryLabel);
      categoryLabel.classList.add("label");

      // Selector de categoría
      const categorySelect = this.ownerDocument.createElement("select");
      categorySelect.id = "category";
      categorySelect.addEventListener("change", this.changeCategorie);
      categorySelect.classList.add("category");

      // Opciones de categoría
      const categories = [
        "Breakfast",
 		"Snacks",
 		"Desserts",
 		"Lunch",
 		"Drinks",
 		"Veggie",
 		"Fit",
      ];
      categories.forEach((category) => {
        const option = this.ownerDocument.createElement("option");
        option.value = category.toLowerCase();
        option.innerText = category;
        categorySelect.appendChild(option);
      });

      // Añadir el selector al contenedor
      categoryContainer.appendChild(categorySelect);

      // Añadir el contenedor de categoría a la sección principal
      section4.appendChild(categoryContainer);


      // Campo del tiempo
      const timeContainer = this.ownerDocument.createElement("div");
      const timeLabel = this.ownerDocument.createElement("label");
      timeLabel.innerText = "Time";
      timeLabel.htmlFor = "time";
      timeContainer.appendChild(timeLabel);
      timeLabel.classList.add("label");

      const pTime = this.ownerDocument.createElement("input");
      pTime.addEventListener("change", this.changeTime);
      timeContainer.appendChild(pTime);
      pTime.classList.add("time");

      section4.appendChild(timeContainer);


      // Contenedor para la dificultad
      const difficultyContainer = this.ownerDocument.createElement("div");

      // Etiqueta para el campo de dificultad
      const difficultyLabel = this.ownerDocument.createElement("label");
      difficultyLabel.innerText = "Difficulty";
      difficultyLabel.htmlFor = "difficulty";
      difficultyContainer.appendChild(difficultyLabel);
      difficultyLabel.classList.add("label");

      // Selector de dificultad
      const difficultySelect = this.ownerDocument.createElement("select");
      difficultySelect.id = "difficulty";
      difficultySelect.addEventListener("change", this.changeDifficulty);
      difficultySelect.classList.add("difficulty");

      // Opciones de dificultad
      const difficulties = ["Easy", "Medium", "High"];
      difficulties.forEach((level) => {
        const option = this.ownerDocument.createElement("option");
        option.value = level.toLowerCase();
        option.innerText = level;
        difficultySelect.appendChild(option);
      });

      // Añadir el selector al contenedor
      difficultyContainer.appendChild(difficultySelect);

      section4.appendChild(difficultyContainer);

      //boton para publicar un post
      const publish = this.ownerDocument.createElement("button");
      publish.innerText = "Publish";
      publish.addEventListener("click", this.submitForm);

      // Agregar la segunda y tercera sección dentro de section 1 y la 1 al shadowroot
      section1.appendChild(section2);
      section1.appendChild(section3);
      section3.appendChild(section4);
      section3.appendChild(publish);
      section5.appendChild(this.shadowRoot.querySelector("#sidebar")!);
      section5.appendChild(section1);
      this.shadowRoot.appendChild(section5);

    }
  }
}

customElements.define("app-createpost", Createpost);
export default Createpost;
