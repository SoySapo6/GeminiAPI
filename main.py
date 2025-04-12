from flask import Flask, redirect
import subprocess
import os
import signal
import threading
import time
import atexit

app = Flask(__name__)

# Variable global para almacenar el proceso del servidor Node.js
node_process = None

def start_node_server():
    """Inicia el servidor Node.js en un subproceso"""
    global node_process
    try:
        # Si ya hay un proceso en ejecución, terminarlo
        if node_process:
            try:
                os.killpg(os.getpgid(node_process.pid), signal.SIGTERM)
            except:
                pass
        
        # Iniciar el servidor Node.js
        print("Iniciando servidor Node.js...")
        node_process = subprocess.Popen(
            "node server.js",
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            preexec_fn=os.setsid  # Crear un nuevo grupo de procesos
        )
        
        # Función para leer y mostrar la salida del servidor Node.js
        def read_output():
            while True:
                if node_process and node_process.poll() is not None:
                    break
                if node_process and node_process.stdout:
                    output = node_process.stdout.readline()
                    if output:
                        print(f"[Node.js] {output.decode().strip()}")
                if node_process and node_process.stderr:
                    error = node_process.stderr.readline()
                    if error:
                        print(f"[Node.js Error] {error.decode().strip()}")
                time.sleep(0.1)
        
        # Iniciar hilo para leer la salida
        threading.Thread(target=read_output, daemon=True).start()
        
        print("Servidor Node.js iniciado correctamente")
        return True
    except Exception as e:
        print(f"Error al iniciar el servidor Node.js: {str(e)}")
        return False

# Función para limpiar y detener el servidor Node.js cuando Flask se detenga
def cleanup():
    global node_process
    if node_process:
        print("Deteniendo servidor Node.js...")
        try:
            os.killpg(os.getpgid(node_process.pid), signal.SIGTERM)
            print("Servidor Node.js detenido correctamente")
        except:
            print("Error al detener el servidor Node.js")

# Registrar la función de limpieza para ejecutarse cuando Flask se detenga
atexit.register(cleanup)

# Iniciar el servidor Node.js cuando se inicie Flask
start_node_server()

@app.route('/')
def index():
    """
    Redirect to the Node.js API server.
    This Flask app is just a placeholder to make the default workflow work.
    The main functionality is in the Node.js server.
    """
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>UkBo API Redirect</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #121212;
                color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                text-align: center;
            }
            .container {
                max-width: 800px;
                padding: 20px;
                background-color: #1e1e1e;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #4d9cff;
                margin-bottom: 20px;
            }
            p {
                margin-bottom: 15px;
                line-height: 1.6;
            }
            .highlight {
                color: #ffb347;
                font-weight: bold;
            }
            .api-url {
                background-color: #252525;
                padding: 15px;
                border-radius: 5px;
                font-family: monospace;
                margin: 15px 0;
                word-break: break-all;
            }
            .note {
                font-size: 0.9em;
                color: #aaaaaa;
                font-style: italic;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>¡Bienvenido a la API de UkBo!</h1>
            <p>¡Chatea con <span class="highlight">Bo</span>, el personaje adolescente del juego de ritmo UkBo creado por SoyMaycol!</p>
            
            <p>Usa los siguientes endpoints para interactuar con Bo:</p>
            
            <div class="api-url">
                /ask/tu-mensaje-aquí
            </div>
            
            <p>O también puedes usar:</p>
            
            <div class="api-url">
                /ask?message=tu-mensaje-aquí
            </div>
            
            <p>¡También soporta español!</p>
            
            <div class="api-url">
                /ask?mensaje=tu-mensaje-aquí
            </div>
            
            <p class="note">La API se encuentra corriendo en el puerto 8000. Para acceder directamente, visita el endpoint /ask con tu mensaje.</p>
        </div>
    </body>
    </html>
    """

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)", port=port)
