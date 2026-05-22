document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los contenedores principales del DOM
    const loginPane = document.getElementById('ind-login-pane');
    const questionsPane = document.getElementById('ind-questions-pane');
    const successPane = document.getElementById('ind-success-pane');
    
    // Controles de entrada e inicio
    const btnLogin = document.getElementById('ind-btn-login');
    const inputName = document.getElementById('ind-user-name');
    const inputRole = document.getElementById('ind-user-role');

    // Variables internas de control de usuario
    let sessionName = "";
    let sessionRole = "";

    // 1. EVENTO DE INGRESO (PANTALLA DE LOGUEO)
    btnLogin.addEventListener('click', () => {
        if (inputName.value.trim() === "") {
            inputName.reportValidity();
            return;
        }

        // Almacenar temporalmente los datos del nuevo colaborador
        sessionName = inputName.value.trim();
        sessionRole = inputRole.value.trim() || "No especificado";

        // Asignar los valores a los inputs ocultos
        document.getElementById('ind-hidden-name').value = sessionName;
        document.getElementById('ind-hidden-role').value = sessionRole;

        // Transición a la vista de preguntas oficiales
        changeView(loginPane, questionsPane);
    });

    // 2. PROCESAMIENTO ASÍNCRONO DEL ENVÍO DE DATOS
    questionsPane.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar recarga de página

        const formAnswers = new FormData(questionsPane);
        
        // Estructura de datos para enviar a Google Sheets
        const submissionPayload = {
            timestamp: new Date().toLocaleString(),
            colaborador: sessionName,
            cargo: sessionRole,
            gusto_proceso: formAnswers.get('gusto_proceso'),
            claridad_info: formAnswers.get('claridad_info'),
            profundizar_tema: formAnswers.get('profundizar_tema'),
            calificacion_atencion: formAnswers.get('calificacion_atencion'),
            bienvenida_equipo: formAnswers.get('bienvenida_equipo'),
            sugerencias: formAnswers.get('sugerencias')
        };

        // --- CONFIGURACIÓN DE GOOGLE SHEETS ---
        
        // REEMPLAZA el link de abajo por el tuyo que termina en /exec
        const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzoxNXWDpbHNWD_8xn6wg6t4VyyVQ1EzehDwUbNT9N6jn-ANXc792eRN850fnQFA07f/exec"; 

        fetch(GOOGLE_SHEETS_URL, {
            method: "POST",
            mode: "no-cors", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submissionPayload)
        })
        .then(() => {
            // Si el envío es exitoso, muestra la pantalla de agradecimiento
            changeView(questionsPane, successPane);
        })
        .catch(err => {
            console.error("Error al enviar a la hoja de cálculo: ", err);
            alert("Hubo un error al enviar tus respuestas. Por favor, intenta de nuevo.");
        });
    });

    // FUNCIÓN DE CONTROL DE TRANSICIONES INTERACTIVAS
    function changeView(fadeOutTarget, fadeInTarget) {
        fadeOutTarget.style.opacity = "0";
        fadeOutTarget.style.transform = "translateY(-15px)";
        
        setTimeout(() => {
            fadeOutTarget.classList.add('ind-view-hidden');
            fadeOutTarget.classList.remove('ind-view-active');
            
            fadeInTarget.classList.remove('ind-view-hidden');
            void fadeInTarget.offsetWidth; // Forzar reflujo de renderizado (Reflow)
            fadeInTarget.classList.add('ind-view-active');
        }, 300);
    }
});