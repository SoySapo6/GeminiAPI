from flask import Flask, redirect

app = Flask(__name__)

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
    app.run(host="0.0.0.0", port=5000, debug=True)