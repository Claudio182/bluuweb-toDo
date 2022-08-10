
//console.log(Date.now())

const formulario = document.getElementById('formulario'),
    listaTarea = document.getElementById('lista-tareas'),
    input = document.querySelector('.form-control')
    template = document.getElementById('template'),
    fragment = document.createDocumentFragment();

let tareas = {}

// escuchar evento tipo submit y escuchar e evento 

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'))
    }
    pintarTareas()
})

formulario.addEventListener('submit', e => {
    // previene prosesamiento de acciones por defecto.
    // en este caso previene peticion GET automatica ///por evento de submit
    e.preventDefault()
    //capturar los valores pasados al input
    //esto es capturar el textContent de la etiqueta input, o su value
    //console.log(e.target.querySelector('input').value)
    setTarea()
})

listaTarea.addEventListener('click', e => {
btnAction(e)
})

const setTarea = e => {
    let valueInput = input.value

    if(valueInput.trim() == '') {
        console.log('Esta vacio...')
        return
    }
    const tarea = {
        id: Date.now(),
        texto: valueInput,
        estado: false
    }

    tareas[tarea.id] = tarea

    console.log(tareas)
    formulario.reset()
    input.focus()

    pintarTareas()
}

const pintarTareas = () => {
    if (Object.values(tareas).length === 0) {
        listaTarea.innerHTML = `
        <div class="alert alert-dark text-center mx-5">
        No hay tareas pendientes 😍
        </div>
        `
        return
    }
    // guardar tareas en local storage
    localStorage.setItem('tareas', JSON.stringify(tareas))
    //Limpiar DOM
    listaTarea.innerHTML = ''
    //por cada valor de objeto en tareas clonar el template
    //asignar el texto de cada tarea(en objetos anidados) en el parrafo del template
    //se agrega el nodo a fragment

    Object.values(tareas).forEach(tarea => {
        const clone = template.content.cloneNode(true)
        clone.querySelector('.nameTarea').textContent = tarea.texto

        if(tarea.estado) {
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary')
            clone.querySelector('.fa-solid').classList.replace('fa-circle-check', 'fa-rotate-left')
            clone.querySelector('p').style.textDecoration = 'line-through'
            clone.querySelector('p').style.color = 'cadetblue'
        }

        clone.querySelector('.text-success').dataset.id = tarea.id
        clone.querySelector('.text-danger').dataset.id = tarea.id
        fragment.appendChild(clone)
    })
    // finalmente se pinta en div #lista-tareas
    listaTarea.appendChild(fragment)
}




const btnAction = (e) => {
    let evento = e.target.classList
    // cambiar estado a activado
    if (evento.contains('fa-solid')){
        tareas[e.target.dataset.id].estado = true
        pintarTareas()
        //console.log(tareas)
    }
    // eliminar una tarea
    if (evento.contains('text-danger')){
        delete tareas[e.target.dataset.id]
        pintarTareas()
    }
    // vuelve tarea tachada a estado false
    if (evento.contains('fa-rotate-left')){
        tareas[e.target.dataset.id].estado = false
        pintarTareas()
        
    }

    e.stopPropagation()
} 