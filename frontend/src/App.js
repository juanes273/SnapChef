import React, { useState, useRef } from "react";

function App() {
  const [responseText, setResponseText] = useState(""); // Texto del textarea
  const [apiResult, setApiResult] = useState(""); // Resultado de la nueva API
  const [loading, setLoading] = useState(false); // Estado de carga
  const fileInputRef = useRef(null); // Referencia al input de archivo
  const textareaRef = useRef(null); // Referencia al textarea

  // Ajuste dinámico del tamaño del textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Manejo del envío del archivo de imagen
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", fileInputRef.current.files[0]);

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResponseText(data.items); // Guardamos el resultado en el estado
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

  // Manejo del clic en el botón de "Traducir"
  const handleTranslate = async () => {
    setLoading(true); // Deshabilitamos el botón durante el proceso

    try {
      // Enviamos el texto para traducir al backend
      const response = await fetch("http://localhost:5000/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: responseText }), // Enviamos el texto a traducir
      });

      const data = await response.json();
      if (data.content) {
        setResponseText(data.content); // Actualizamos el texto traducido en el estado
      } else {
        console.error("Error al traducir el texto");
      }
    } catch (error) {
      console.error("Error al traducir:", error);
    } finally {
      setLoading(false); // Restablecemos el estado de carga
    }
  };

  // Llamado a la API "recipie" para procesar el texto ingresado
  const handleProcessText = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/recipie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: responseText }), // Enviamos el contenido del texto
      });

      const data = await response.json();
      if (data.content) {
        setApiResult(data.content); // Guardamos el resultado de la API
      } else {
        console.error("No se recibió un resultado válido de la API");
      }
    } catch (error) {
      console.error("Error al llamar a la API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Subir Imagen</h1>
      <input type="file" ref={fileInputRef} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Procesando..." : "Subir Imagen"}
      </button>

      {/* Textarea donde mostramos el texto y se actualiza dinámicamente */}
      <textarea
        ref={textareaRef}
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
        onInput={adjustTextareaHeight} // Ajustamos el tamaño dinámicamente
        style={{
          width: "100%",
          overflow: "hidden",
          resize: "none",
          fontSize: "16px",
          padding: "10px",
          marginTop: "20px",
        }}
        placeholder="Escribe algo aquí..."
        rows={4}
      />

      {/* Botón de traducción */}
      <button
        style={{
          marginTop: "10px",
          display: "block",
          width: "100%",
        }}
        onClick={handleTranslate}
        disabled={loading}
      >
        {loading ? "Traduciendo..." : "Traducir"}
      </button>

      {/* Botón para procesar texto con la API "recipie" */}
      <button
        style={{
          marginTop: "10px",
          display: "block",
          width: "100%",
        }}
        onClick={handleProcessText}
        disabled={loading}
      >
        {loading ? "Procesando..." : "Procesar Texto"}
      </button>

      {/* Contenedor donde mostramos el resultado de la API "recipie" */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>Resultado de la API "recipie"</h3>
        <p>{apiResult || "El resultado aparecerá aquí..."}</p>
      </div>
    </div>
  );
}

export default App;
