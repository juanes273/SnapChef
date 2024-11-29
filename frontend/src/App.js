import React, { useState, useRef } from "react";

function App() {
  const [responseText, setResponseText] = useState("");  // Guardamos el texto que va al input
  const [loading, setLoading] = useState(false);  // Para gestionar el estado de carga
  const fileInputRef = useRef(null);  // Para referenciar el input de archivo
  const textareaRef = useRef(null);  // Para referenciar el textarea

  // Función para ajustar el tamaño dinámicamente del textarea
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
      setResponseText(data.items);  // Guardamos el resultado en el estado
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

  // Manejo del clic en el botón de "Traducir"
  const handleTranslate = async () => {
    setLoading(true);  // Deshabilitamos el botón durante el proceso

    try {
      // Enviamos el texto para traducir al backend
      const response = await fetch("http://localhost:5000/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: responseText }),  // Enviamos el texto a traducir
      });

      const data = await response.json();
      if (data.content) {
        setResponseText(data.content);  // Actualizamos el texto traducido en el estado
      } else {
        console.error("Error al traducir el texto");
      }
    } catch (error) {
      console.error("Error al traducir:", error);
    } finally {
      setLoading(false);  // Restablecemos el estado de carga
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
        value={responseText}  // El valor se obtiene de 'responseText'
        onChange={(e) => setResponseText(e.target.value)}  // Actualizamos el estado al escribir
        style={{
          width: "100%",
          overflow: "hidden",
          resize: "none",
          fontSize: "16px",
          padding: "10px",
          marginTop: "20px",
        }}
        placeholder="La respuesta aparecerá aquí..."
        rows={4}  // Para tener un tamaño inicial de 4 líneas
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
    </div>
  );
}

export default App;
