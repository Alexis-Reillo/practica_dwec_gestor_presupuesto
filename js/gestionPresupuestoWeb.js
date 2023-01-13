'use strict';
import * as gestionPresupuesto from "./gestionPresupuesto.js";
function mostrarDatoEnId(idElemento,valor)
{
    document.getElementById(idElemento).innerHTML = valor;
}
function mostrarGastoWeb(idElemento, gastos)
{
    let elemento = document.getElementById(idElemento);
    gastos.forEach(gasto => {
        let DIVgasto = document.createElement('div');
        DIVgasto.className = 'gasto';
        let DIVdescripcion = document.createElement('div');
        DIVdescripcion.className = 'gasto-descripcion';
        DIVdescripcion.innerHTML = gasto.descripcion;
        let DIVfecha = document.createElement('div');
        DIVfecha.className = 'gasto-fecha';
        let fechatostring = new Date(gasto.fecha);
        DIVfecha.innerHTML = fechatostring.toLocaleString();
        let DIVvalor = document.createElement('div');
        DIVvalor.className = 'gasto-valor';
        DIVvalor.innerHTML = gasto.valor;
        let DIVetiquetas = document.createElement('div');
        DIVetiquetas.className = 'gasto-etiquetas';
        DIVgasto.appendChild(DIVdescripcion);
        DIVgasto.appendChild(DIVfecha);
        DIVgasto.appendChild(DIVvalor);
        gasto.etiquetas.forEach(etiqueta => {
            let SPANetiqueta = document.createElement('span');
            SPANetiqueta.className = 'gasto-etiquetas-etiqueta';
            SPANetiqueta.innerHTML = " " + etiqueta;
            DIVetiquetas.appendChild(SPANetiqueta);

            let borraretiqueta = new BorrarEtiquetasHandle();
            borraretiqueta.gasto = gasto;
            borraretiqueta.etiquetas = etiqueta;
            SPANetiqueta.addEventListener('click',borraretiqueta);
        });
        DIVgasto.appendChild(DIVetiquetas);

        let BUTTONeditar = document.createElement('button');
        BUTTONeditar.type = 'button';
        BUTTONeditar.className = 'gasto-editar';
        BUTTONeditar.innerHTML = "Editar";
        let editargasto = new EditarHandle();
        editargasto.gasto = gasto;
        BUTTONeditar.addEventListener('click',editargasto);
        
        let BUTTONborrar = document.createElement('button');
        BUTTONborrar.className = 'gasto-borrar';
        BUTTONborrar.innerHTML = "Borrar";
        BUTTONborrar.type = 'button';
        let borrargasto = new BorrarHandle();
        borrargasto.gasto = gasto;
        BUTTONborrar.addEventListener('click',borrargasto);
        
        let BUTTONeditarformulario = document.createElement('button');
        BUTTONeditarformulario.type = 'button';
        BUTTONeditarformulario.className = 'gasto-editar-formulario';
        BUTTONeditarformulario.innerHTML = "Editar (formulario)";

        let editargastoformulario = new EditarHandleformulario();
        editargastoformulario.gasto = gasto;
        editargastoformulario.DIVgasto = DIVgasto;
        editargastoformulario.BUTTONeditarformulario = BUTTONeditarformulario;
        BUTTONeditarformulario.addEventListener('click',editargastoformulario);
        
        DIVgasto.appendChild(BUTTONeditar);
        DIVgasto.appendChild(BUTTONborrar);
        DIVgasto.appendChild(BUTTONeditarformulario);

        elemento.appendChild(DIVgasto);
    });
}
function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo)
{
    let elemento = document.getElementById(idElemento);
    let DIVagrupacion = document.createElement('div');
    DIVagrupacion.className = 'agrupacion';
    let H1titulo = document.createElement('h1');
    H1titulo.innerHTML = 'Gastos agrupados por ' + periodo;
    DIVagrupacion.appendChild(H1titulo);
    for(let propiedad of Object.keys(agrup))
    {
        let DIVdato = document.createElement('div');
        DIVdato.className = 'agrupacion-dato';
        let SPANclave = document.createElement('span');
        SPANclave.className = 'agrupacion-dato-clave';
        SPANclave.innerHTML += `${propiedad}`;
        let SPANvalor = document.createElement('span');
        SPANvalor.className = 'agrupacion-dato-valor';
        SPANvalor.innerHTML += " " + agrup[propiedad] + " €";
        DIVdato.appendChild(SPANclave);
        DIVdato.appendChild(SPANvalor);
        DIVagrupacion.appendChild(DIVdato);
    }
    elemento.appendChild(DIVagrupacion);
}
function actualizarPresupuestoWeb(){
    let mensaje = prompt("Introduce el presupuesto deseado:",0);
    gestionPresupuesto.actualizarPresupuesto(parseInt(`${mensaje}`,10));
    repintar();
}

let actualizarpresupuesto = document.getElementById('actualizarpresupuesto');
actualizarpresupuesto.addEventListener('click',actualizarPresupuestoWeb);

function repintar(){
    mostrarDatoEnId('presupuesto',gestionPresupuesto.mostrarPresupuesto());
    mostrarDatoEnId('gastos-totales', gestionPresupuesto.calcularTotalGastos());
    mostrarDatoEnId('balance-total', gestionPresupuesto.calcularBalance());
    mostrarDatoEnId('listado-gastos-completo', "");
    mostrarGastoWeb('listado-gastos-completo', gestionPresupuesto.listarGastos());
}
function nuevoGastoWeb(){
    let descripcion = prompt("Introduce la descripción del gasto:","");
    let aux = prompt("Introduce el valor del gasto:","");
    let valor = parseFloat(aux, 10);
    let fecha = prompt("Introduce la fecha del gasto:\n(Introducirla en el formato indicado)","yyyy/mm/dd");
    let cadena = prompt("Introduce las etiquetas del gasto:\n(Introduzca las etiquetas como en el ejemplo)","etiqueta1,etiqueta2,etiqueta3...");
    let etiquetas = cadena.split(',');
    let nuevogasto = new gestionPresupuesto.CrearGasto(descripcion,valor,fecha,etiquetas);
    gestionPresupuesto.anyadirGasto(nuevogasto);
    repintar();
}

let annyadirgasto = document.getElementById('anyadirgasto');
annyadirgasto.addEventListener('click', nuevoGastoWeb);

function EditarHandle(){
    this.handleEvent = function (event) {
        let descripcion = prompt("Introduce la descripción del gasto:","");
        let aux = prompt("Introduce el valor del gasto:","");
        let valor = parseFloat(aux, 10);
        let fecha = prompt("Introduce la fecha del gasto:\n(Introducirla en el formato indicado)","yyyy/mm/dd");
        let cadena = prompt("Introduce las etiquetas del gasto:\n(Introduzca las etiquetas como en el ejemplo)","etiqueta1,etiqueta2,etiqueta3...");
        let etiquetas = cadena.split(',');
        this.gasto.actualizarDescripcion(descripcion);
        this.gasto.actualizarValor(valor);
        this.gasto.actualizarFecha(fecha);
        this.gasto.anyadirEtiquetas(etiquetas);
        repintar();
    };
}

function BorrarHandle(){
    this.handleEvent = function(event){
        let id = this.gasto.id;
        gestionPresupuesto.borrarGasto(id);
        repintar();
    };
}

function BorrarEtiquetasHandle(){
    this.handleEvent = function (event){
        this.gasto.borrarEtiquetas(this.etiquetas);
        repintar();
    };
}

function EditarHandleformulario(){
    this.handleEvent = function (event) {
        let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
        let formulario = plantillaFormulario.querySelector("form");
        this.DIVgasto.append(formulario);
        formulario.elements.descripcion.value = this.gasto.descripcion;
        formulario.elements.valor.value = this.gasto.valor;
        formulario.elements.fecha.value = this.gasto.fecha;
        formulario.elements.etiquetas.value = this.gasto.etiquetas;
 
        let EnviarForm = new EnviarEditarHandleformulario();
        EnviarForm.gasto = this.gasto;
        EnviarForm.formulario = formulario;
        formulario.addEventListener("submit",EnviarForm);
        this.BUTTONeditarformulario.setAttribute('disabled','');
        let CancelarForm =  new CancelarEditarHandleformulario();
        CancelarForm.formulario = formulario;
        CancelarForm.BUTTONeditarformulario = this.BUTTONeditarformulario;
        CancelarForm.formulario = formulario;
        let BUTTONcancelar = formulario.querySelector('button.cancelar');
        BUTTONcancelar.addEventListener('click',CancelarForm);
    };
}

function CancelarEditarHandleformulario(){
    this.handleEvent = function (event){
        this.formulario.remove();
        this.BUTTONeditarformulario.removeAttribute("disabled");
    }

}

function EnviarEditarHandleformulario(){
    this.handleEvent = function (event){
        event.preventDefault();
        this.gasto.descripcion = this.formulario.elements.descripcion.value;
        this.gasto.valor = parseFloat(this.formulario.elements.valor.value);
        this.gasto.fecha = new Date (this.formulario.elements.fecha.value);
        this.gasto.etiquetas = toString(this.formulario.elements.etiquetas.value).split(",");
        repintar();
    }
}
function nuevoGastoWebFormulario(){
    let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
    let formulario = plantillaFormulario.querySelector("form");
    let DIVcontrolesprincipales = document.getElementById('controlesprincipales');
    DIVcontrolesprincipales.append(formulario);
    document.getElementById('anyadirgasto-formulario').setAttribute('disabled','');
    let Enviar = new funcionEnviar();
    formulario.addEventListener("submit",Enviar);
    let Cancelar =  new funcionCancelar();
    let BUTTONcancelar = formulario.querySelector("button.cancelar");
    BUTTONcancelar.addEventListener('click',Cancelar);
    repintar();
}

let gastoformulario = document.getElementById('anyadirgasto-formulario');
gastoformulario.addEventListener('click', nuevoGastoWebFormulario);

function funcionEnviar(){
    this.handleEvent = function(event){
        event.preventDefault();
        let formulario = event.currentTarget;
        let descripcion = formulario.elements.descripcion.value;
        let aux = formulario.elements.valor.value;
        let valor = parseFloat(aux, 10);
        let fecha = new Date(formulario.elements.fecha.value);
        let cadena = toString(formulario.elements.etiquetas.value);
        let etiquetas = cadena.split(',');
        let gasto = new gestionPresupuesto.CrearGasto(descripcion,valor,fecha, ...etiquetas);
        gestionPresupuesto.anyadirGasto(gasto);
        document.getElementById('anyadirgasto-formulario').removeAttribute('disabled');
        repintar();
    }
}

function funcionCancelar(){
    this.handleEvent = function(event){
        event.preventDefault();
        let formulario = event.currentTarget;
        formulario.remove();
        document.getElementById('anyadirgasto-formulario').removeAttribute('disabled');
        repintar();
    }
}
function filtrarGastosWeb(){
    this.handleEvent = function(event){
        event.preventDefault();
        let FormularioFiltrado = event.currentTarget;
        let Etiquetas = FormularioFiltrado.elements["formulario-filtrado-etiquetas-tiene"];
        if(Etiquetas != "")
        {
            Etiquetas = gestionPresupuesto.transformarListadoEtiquetas(Etiquetas);
        }
        let ValMinimo = parseFloat(FormularioFiltrado.elements["formulario-filtrado-valor-minimo"].value);
        let ValMaximo = parseFloat(FormularioFiltrado.elements["formulario-filtrado-valor-maximo"].value);
        let FechDesde = new Date (FormularioFiltrado.elements["formulario-filtrado-fecha-desde"].value);
        let FechHasta = new Date (FormularioFiltrado.elements["formulario-filtrado-fecha-hasta"].value);
        let Descripcion = FormularioFiltrado.elements["formulario-filtrado-descripcion"].value;
        let Filtrar = gestionPresupuesto.filtrarGastos({fechaDesde:FechDesde,fechaHasta:FechHasta,valorMaximo:ValMaximo,valorMinimo:ValMinimo,descripcionContiene:Descripcion,etiquetasTiene:Etiquetas});
        mostrarDatoEnId("listado-gastos-completo", "");
        mostrarGastoWeb("listado-gastos-completo",Filtrar);
    }
}

let FiltrarGastos = new filtrarGastosWeb();
let FormularioFiltrado = document.getElementById("formulario-filtrado");
FormularioFiltrado.addEventListener("submit",FiltrarGastos);

export{
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
    actualizarPresupuestoWeb,
    repintar,
    nuevoGastoWebFormulario,
    nuevoGastoWeb,
    filtrarGastosWeb
}