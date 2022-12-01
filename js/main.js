//elements
const body = document.getElementsByTagName("body")
const main = document.querySelector("main");
const categorias = document.querySelector("#categorias");
const buscar = document.querySelector("#buscar");
const mod = document.querySelector("#mod");
//API
const canalesGeneral = async () => {
  try {
    const response = await fetch("db.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

//event listeners
window.addEventListener("load", mostrarCanales);
categorias.addEventListener("change", filtroCanales);
buscar.addEventListener("keyup", buscador);

async function filtroCanales(e) {
  main.innerHTML = "";
  const filtro = await canalesGeneral();
  filtro.map((canalesCategoria) => {
    const { categoria, imagen, id } = canalesCategoria;
    if (categoria === e.target.value) {
      main.innerHTML += `
    <div class="cont" data-aos="" data-aos-anchor-placement="center-bottom" data-scroll="out" data-id=${id}>
    <img src="${imagen}" alt="" srcset="" class="imagenCanal">
    </div>`;
    } else if (categorias.value == "todos") {
      main.innerHTML += `
    <div class="cont" data-aos="" data-aos-anchor-placement="center-bottom" data-scroll="out" data-id=${id}>
    <img src="${imagen}" alt="" srcset="" class="imagenCanal">
    </div>`;
    }
  });
  infoModal();
  fx();
}

async function mostrarCanales() {
  const channels = await canalesGeneral();
  channels.map((canalId) => {
    const { imagen, id } = canalId;
    main.innerHTML += `
    <div class="cont" data-aos="" data-aos-anchor-placement="center-bottom" data-scroll="out" data-id=${id}>
    <img src="${imagen}" alt="" srcset="" class="imagenCanal">
    </div>`;
  });
  infoModal();
  fx();
}

function fx() {
  const effect = document.querySelectorAll(".cont");
  effect.forEach(() => {
    ScrollOut({
      onShown: function (item) {
        // use the web animation API
        item.dataset.aos = "zoom-out";
      },
      onHidden: function (item) {
        // hide the element initially
        item.dataset.aos = "zoom-in";
      },
    });
  });
}

async function buscador(e) {
  e.preventDefault();
  main.innerHTML = "";
  const channels = await canalesGeneral();
  channels.map((canalesBusqueda) => {
    const { nombre, imagen, id } = canalesBusqueda;
    if (
      nombre.toLowerCase().includes(e.target.value) ||
      nombre.includes(e.target.value)
    ) {
      main.innerHTML += `
    <div class="cont" data-aos="" data-aos-anchor-placement="center-bottom" data-scroll="out" data-id=${id}>
    <img src="${imagen}" alt="" srcset="" class="imagenCanal">
    </div>`;
    }
  });
  infoModal();
  fx();
}

async function infoModal() {
  const infoCanal = await canalesGeneral();
  const cont = document.querySelectorAll(".cont");
  infoCanal.map((canalInfo) => {
    cont.forEach((canalesCont) => {
      const { id, numero, nombre, categoria, descripcion } = canalInfo;
      canalesCont.addEventListener("click", modal);
      function modal() {
        document.body.style.overflow = "hidden"
        mod.classList.add("glass");
        mod.classList.remove("d-none");
        mod.classList.add("slide-in-bck-center");
        mod.classList.remove("slide-out-bck-center");
        if (canalesCont.dataset.id == id) {
          mod.innerHTML = `
          <div class="salir">
          <h3>X</h3>
          </div>
          <div class="card">
          <div class="info">
          <h1 class="canal">Canal: ${numero}</h1>
          <p class="nombre">${nombre}</p>
          <p class="categoria">${categoria}</p>
          <p>${descripcion}</p>
          <div class="btnContainer">
          <button class="btnGuia btn btn-primary" id=${id}>Programacion</button>
          </div></div>
          </div>
          `;
          callBacks();
        }
      }
    });
  });
}
function callBacks() {
  const btnGuia = document.querySelector(".btnGuia");
  btnGuia.addEventListener("click", guia);

  const salir = document.querySelector(".salir");
  salir.addEventListener("click", cerrar);
}
async function guia(e) {
  const programaciones = await canalesGeneral();
  programaciones.forEach((programacionPaginas) => {
   const {guia, id} = programacionPaginas
    if(id == e.target.id){
      window.open(guia);
    }
  });
}
function cerrar() {
  mod.innerHTML = "";
  document.body.style.overflow = ""
  mod.classList.remove("slide-in-bck-center");
  mod.classList.add("slide-out-bck-center");
  setTimeout(() => {
    mod.classList.remove("glass");
    mod.classList.add("d-none");
  }, 500);
}
