//variáveis auxiliares

const baseUrl = "http://localhost:3000";
let paletteList = [];

//separando as responsabilidades
//*REQUISIÇÕES
//todo FAZER REQUISIÇÕES EM FORMA DE CLASSE NO PRÓXIMO PROJETO

const searchAllPalettes = async () => {
  const response = await fetch("http://localhost:3000/palettes/getAllPalettes");
  const palettes = await response.json();

  paletteList = palettes;

  return palettes;
};

// searchAllPalettes();

const searchIdPalettes = async (id) => {
  const response = await fetch(`${baseUrl}/palettes/getByIdPalettes/${id}`);

  if (response.status === 404) {
    return "Paleta não econtrada!";
  }

  const palettes = await response.json();

  return palettes;
};

// searchIdPalettes();

const createPalette = async (flavor, description, img, price) => {
  const palette = {
    //pego os parâmetros que são passador pela função para a criação do objeto
    flavor,
    description,
    img,
    price,
  };

  //nas configurações das requisições terão o cabeçalho, estou informando que o body que está indo será em json
  //faço a ligação do fetch para trazer as informações das rotas
  const response = await fetch(`${baseUrl}/palettes/createNewPalette`, {
    method: "POST", //método que será enviado, POST criação
    headers: { "Content-Type": "application/json" }, //cabeçalho
    mode: "cors", //não é necessário porém são boas práticas
    body: JSON.stringify(palette), //tipos de dados que virão do body do corpo da criação
  });

  const newPalette = await response.json(); //recebo as informações transformando em json e criando o objeto

  return newPalette;
};

// createPalette("hocolate", "teste1", "teste2", "teste3");

const updatePalette = async (id, flavor, description, img, price) => {
  const palette = {
    //pego os parâmetros que são passador pela função para a criação do objeto
    flavor,
    description,
    img,
    price,
  };

  const response = await fetch(`${baseUrl}/palettes/updatePalette/${id}`, {
    method: "PUT", //!atenção que o método passado no updatePalette é um PUT
    headers: { "content-type": "application/json" },
    mode: "cors",
    body: JSON.stringify(palette), //corpo da atualização
  });

  const updatedPalette = await response.json(); //recebo as informações transformando em json e criando o objeto

  return updatedPalette;
};

// updatePalette(3, "Atualização", "Atualizar description", "assets/imgs", "10");

const deletePalette = async (id) => {
  const response = await fetch(`${baseUrl}/palettes/deletePalette/${id}`, {
    method: "DELETE", //!atenção ao método DELETE
    mode: "cors",
  });

  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
};

// deletePalette(3);
//*MANIPULAÇÃO DO DOCUMENTO insertAdjacentHTML

const printAllPalettes = async () => {
  const palettes = await searchAllPalettes();

  palettes.forEach((element) => {
    document.getElementById("paletteList").insertAdjacentHTML(
      "beforeend",
      `
            <div class="PaletteListItem">
                <div>
                  <div class="PaletteListItem__flavor">
                    ${element.flavor}
                  </div>
                  <div class="PaletteListItem__price">${element.price}</div>
                  <div class="PaletteListItem__description">
                  ${element.description}
                  </div>
                  <div>
  <button class="button" onclick="showModalDelete('${element._id}')">APAGAR</button>
  <button class="button" onclick="showModalEdit('${element._id}')">EDITAR</button>
  </div>
                </div>
                <img class="PaletteListItem__img"
                src=${element.img} alt="Paleta ${element.flavor}" />
              </div>
            `
    );
  });
};

printAllPalettes();

const showPaletteById = async () => {
  const flavor = document.getElementById("searchFlavorInput").value;

  const chosenPalette = paletteList.find(
    (palette) => palette.flavor === flavor
  );
  const id = chosenPalette._id;

  const palette = await searchIdPalettes(id);

  if (typeof palette === "string") {
    document.getElementById("paletteById").innerText = "Paleta não econtrada!";
  } else {
    document.getElementById("paletteById").innerHTML = `
  <div class="PaletteListItem">
  <div>
    <div class="PaletteListItem__flavor">
      ${palette.flavor}
    </div>
    <div class="PaletteListItem__price">${palette.price}</div>
    <div class="PaletteListItem__description">
    ${palette.description}
    </div>
    <div>
  <button class="button" onclick="showModalDelete('${palette._id}')">APAGAR</button>
  <button class="button" onclick="showModalEdit('${palette._id}')">EDITAR</button>
  </div>
  </div>
  <img class="PaletteListItem__img"
  src=${palette.img} alt="Paleta ${palette.flavor}" />
</div>
  `;
  }

  setTimeout(() => {
    document.getElementById("paletteById").innerHTML = "";
  }, "4000");
};

const showModal = () => {
  document.getElementById("modal__overlay").style.display = "flex";
};

const showModalDelete = (id) => {
  document.getElementById("modal__overlay__delete").style.display = "flex";

  const buttonYes = document.getElementById("buttonYes");

  buttonYes.addEventListener("click", async () => {
    const fact = await deletePalette(id);

    if (fact) {
      alert("Paleta Excluida!");
    } else {
      alert("Erro na exclusão!");
    }
    closeModalDelete();
  });
};

const closeModal = () => {
  document.getElementById("inputFlavor").value = "";
  document.getElementById("inputDescription").value = "";
  document.getElementById("inputImg").value = "";
  document.getElementById("inputPrice").value = "";

  document.getElementById("modal__overlay").style.display = "none";
};

const closeModalDelete = () => {
  document.getElementById("modal__overlay__delete").style.display = "none";
  window.location.reload();
};

const insertNewPalette = async () => {
  const flavor = document.getElementById("inputFlavor").value;
  const description = document.getElementById("inputDescription").value;
  const img = document.getElementById("inputImg").value;
  const price = document.getElementById("inputPrice").value;

  const palette = await createPalette(flavor, description, img, price);

  closeModal();

  document.getElementById("paletteList").insertAdjacentHTML(
    "beforeend",
    `
        <div class="PaletteListItem">
            <div>
              <div class="PaletteListItem__flavor">
                ${palette.flavor}
              </div>
              <div class="PaletteListItem__price">${palette.price}</div>
              <div class="PaletteListItem__description">
              ${palette.description}
              </div>
              <div>
  <button class="button" onclick="showModalDelete('${palette._id}')">APAGAR</button>
  <button class="button" onclick="showModalEdit('${palette._id}')">EDITAR</button>
  </div>
            </div>
            <img class="PaletteListItem__img"
            src=${palette.img} alt="Paleta ${palette.flavor}" />
          </div>
        `
  );
};

const showModalEdit = (id) => {
  document.getElementById("modal__overlayEdit").style.display = "flex";

  const palette = paletteList.find((element) => element._id === id);

  document.getElementById("inputFlavorEdit").value = palette.flavor;
  document.getElementById("inputDescriptionEdit").value = palette.description;
  document.getElementById("inputImgEdit").value = palette.img;
  document.getElementById("inputPriceEdit").value = palette.price;

  const updateButton = document.getElementById("updateButton");

  updateButton.addEventListener("click", async () => {
    const flavor = document.getElementById("inputFlavorEdit").value;
    const description = document.getElementById("inputDescriptionEdit").value;
    const img = document.getElementById("inputImgEdit").value;
    const price = document.getElementById("inputPriceEdit").value;
    const updated = await updatePalette(id, flavor, description, img, price);
    closeModalEdit();
  });
  
};

const closeModalEdit = () => {
  document.getElementById("modal__overlay__delete").style.display = "none";
  window.location.reload();
};
