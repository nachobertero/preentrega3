
// OBTENGO LA REFERENCIA DEL FORMULARIO
const form = document.getElementById("form");
const btnCalcular = document.getElementById("calculo1");
btnCalcular.addEventListener("click", calcularTotal); 

// AGREGO UN EVENTO SUBMIT
form.addEventListener("submit", calcularTotal);

// QUE HAGO CUANDO ENVIO EL FORMULARIO ? 
function calcularTotal(event) {

  event.preventDefault(); //PARA QUE LA PAGINA NO SE RECARGUE

  document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    // EL FORMULARIO VEHICULO SE ENCUENTRA OCULTO INICIALMENTE, SE MUESTRA CUANDO SE DA CLICK EN QUIERO ENTREGAR UN VEHICULO
    document.getElementById('segundoFormulario').style.display = 'block';
  });

  // OBTENGO LAS REFERENCIAS DE LO INGRESADO EN LOS FORMULARIOS
  const cantidadCuotas = parseInt(document.getElementById("cantidadCuotas").value);
  const valorVehiculo = parseFloat(document.getElementById("valorVehiculo").value);
  const tna = parseFloat(document.getElementById("tna").value / 12 / 100).toFixed(2);
  const patenteAnual = parseFloat(document.getElementById("patenteAnual").value) / 12;

  const marca = document.getElementById("marca").value;
  const modelo = document.getElementById("modelo").value;
  const año = parseInt(document.getElementById("año").value);
  const kilometraje = parseInt(document.getElementById("kilometraje").value);

  entrega = estimarValor(año);

  // CALCULO DE LA CUOTA INICIAL
  const cuotaInicial = (valorVehiculo - entrega) / cantidadCuotas;

  let mes = 0;
  let cuotaMensual = cuotaInicial;

  let numeroDeCuota = []; // ARRAY NUMERO DE CUOTA
  let montoDeCuota = []; // ARRAY MONTO

  const aumentoValorAuto = 0.40 / 12;

  // Ciclo: Opté por un while

  while (mes <= cantidadCuotas) {
    numeroDeCuota.push(`${mes}:`);
    montoDeCuota.push(`$ ${cuotaMensual.toFixed(0)}`);
    cuotaMensual += cuotaInicial * tna + cuotaInicial * aumentoValorAuto;
    mes++;
  } // ASI LA CUOTA VA AUMENTANDO Y SE COLOCA EL VALOR CORRESPONDIENTE

  // OBTENGO LA REFERENCIA DE LA TABLA PARA PODER CREARLE LA LISTA DE CUOTAS CON LOS MONTOS Y EL VALOR DE LA PATENTE
  const listaCuotas = document.getElementById("tabla");
  listaCuotas.classList.add("tabla-con-fade"); 
  let añoCompleto = 0;

  for (let i = 0; i < numeroDeCuota.length; i++) {
    const nuevaFila = document.createElement("tr");

    const numeroCuota = document.createElement("td");
    numeroCuota.innerText = numeroDeCuota[i];
    nuevaFila.appendChild(numeroCuota);

    const montoCuota = document.createElement("td");
    montoCuota.innerText = montoDeCuota[i];
    nuevaFila.appendChild(montoCuota);

    // SI EL NUMERO DE CUOTA ES MULTIPLO DE 12, APARECE EL VALOR PATENTE ACTUALIZADO
    if (parseInt(numeroDeCuota[i]) % 12 === 0) {
      añoCompleto++;
    }

    const patenteAnualActualizada = patenteAnual * Math.pow(1.25, añoCompleto);

    const patente = document.createElement("td");
    patente.innerText = (parseInt(numeroDeCuota[i]) % 12 === 0) ? ` $ ${patenteAnualActualizada.toFixed(2)}` : "-";
    nuevaFila.appendChild(patente);

    listaCuotas.appendChild(nuevaFila);
  }

  // SESSION STORAGE: GUARDO LOS DATOS QUE EL USUARIO INGRESÓ EN EL PRIMER FORMULARIO
  const guardarFormulario = {
    cantidadCuotas: cantidadCuotas,
    valorVehiculo: valorVehiculo,
    tna: tna * 12 * 100,
    patenteAnual: patenteAnual * 12 ,
  };

  const guardarFormularioJSON = JSON.stringify(guardarFormulario);
  sessionStorage.setItem('formularioData', guardarFormularioJSON);
}


const formulario = document.getElementById("form");


formulario.addEventListener("submit", function(event) {

  event.preventDefault();

  // CREO EL SEGUNDO FORMULARIO
  const formularioAdicional = document.createElement("form");
  formularioAdicional.innerHTML = `
    <div class="formVehiculo">
      <h1>Tu Vehículo</h1>
      <div class="grupo">
        <input type="text" name="marca" id="marca" required><span class="barra"></span>
        <label for="marca">Marca</label>
      </div>
      <div class="grupo">
        <input type="text" name="modelo" id="modelo" required><span class="barra"></span>
        <label for="modelo">Modelo</label>
      </div>
      <div class="grupo">
        <input type="number" name="año" id="año" required><span class="barra"></span>
        <label for="año">Año</label>
      </div>
      <div class="grupo">
        <input type="number" name="kilometraje" id="kilometraje" required><span class="barra"></span>
        <label for="kilometraje">Kilometraje</label>
      </div>
      <button type="submit">Calcular</button>
    </div>
  `;

  // AGREGO ESTE FORMULARIO AL BODY
  document.body.appendChild(formularioAdicional);

  // LE AGREGO UN SUBMIT AL FORMULARIO ADICIONAL
  formularioAdicional.addEventListener("submit", function(event) {
    // Evitar que se recargue la página
    event.preventDefault();
    // SI QUISIERA ELIMINAR EL FORMULARIO ADICIONAL
    /* document.body.removeChild(formularioAdicional); */
  });
});

function estimarValor(año) {
  let entrega = 0;

  if (año >= 2015 && año <= 2023) {
    entrega = 6000000;
    const mensaje = document.getElementById("valorEntrega");
    mensaje.innerHTML = `Tu auto es ${año}. Podríamos <br> tomarlo  en aproximadamente <br> 6 millones de pesos.`; 
  } else if (año >= 2000 && año < 2015) {
    entrega = 2000000;
    const mensaje = document.getElementById("valorEntrega");
    mensaje.innerHTML = `Tu auto es ${año}. Podríamos <br> tomarlo en aproximadamente <br> 2 millones de pesos.`;
  } else if (año < 2000) {
    entrega = 0;
    const mensaje = document.getElementById("valorEntrega");
    mensaje.innerHTML = `Tu auto es ${año}. No estamos tomando <br> vehículos anteriores al año 2000.`;
  }

  return entrega;
}


// RECUPERO LOS VALORES DEL SESSION STORAGE CON UN EVENTO LOAD
window.addEventListener("load", function() {
  const dataFormularioJSON = sessionStorage.getItem('formularioData');
  if (dataFormularioJSON) {
    const recuperarFormulario = JSON.parse(dataFormularioJSON);
    document.getElementById("cantidadCuotas").value = recuperarFormulario.cantidadCuotas;
    document.getElementById("valorVehiculo").value = recuperarFormulario.valorVehiculo;
    document.getElementById("tna").value = recuperarFormulario.tna;
    document.getElementById("patenteAnual").value = recuperarFormulario.patenteAnual;
  }
});
