import React, { useState, useRef } from "react";

function App() {
  const [responseText, setResponseText] = useState(""); // Texto ingresado
  const [simulatedResult, setSimulatedResult] = useState(""); // Resultado simulado
  const [loading, setLoading] = useState(false); // Estado de carga
  const fileInputRef = useRef(null); // Referencia al input de archivo
  const textareaRef = useRef(null); // Referencia al textarea

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
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: responseText }),
      });

      const data = await response.json();
      if (data.content) {
        setResponseText(data.content);
      } else {
        console.error("Error al traducir el texto");
      }
    } catch (error) {
      console.error("Error al traducir:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para simular el llamado a una API que devuelve el texto ingresado
  const handleSimulateAPI = () => {
    setLoading(true);
    setTimeout(() => {
      setSimulatedResult(responseText); // Guardamos el resultado en 'simulatedResult'
      setLoading(false);
    }, 1000); // Simulamos un retardo de 1 segundo
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

      {/* Botón para simular el llamado a la API */}
      <button
        style={{
          marginTop: "10px",
          display: "block",
          width: "100%",
        }}
        onClick={handleSimulateAPI}
        disabled={loading}
      >
        {loading ? "Procesando..." : "Simular API"}
      </button>

      {/* Contenedor donde mostramos el resultado simulado */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>Resultado de recetas</h3>
        <p>{simulatedResult || "El resultado aparecerá aquí..."}</p>
      </div>
    </div>
  );
}

export default App;
