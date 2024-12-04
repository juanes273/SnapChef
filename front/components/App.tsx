'use client';

import React, { useState, useRef } from "react";
import ReactMarkdown from 'react-markdown';

function App() {
  const [responseText, setResponseText] = useState("");
  const [apiResult, setApiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

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
      setResponseText(data.items);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleProcessText = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/recipie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: responseText }),
      });

      const data = await response.json();
      if (data.content) {
        setApiResult(data.content);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-blue-100 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Procesador de Imágenes y Texto</h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-white mb-2">
              Subir Imagen
            </label>
            <div className="flex items-center space-x-4">
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => e.target.files[0] && fileInputRef.current.files[0].name}
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-white bg-opacity-20 rounded-md text-white cursor-pointer hover:bg-opacity-30 transition duration-300"
              >
                Seleccionar archivo
              </label>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              >
                {loading ? "Procesando..." : "Subir Imagen"}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-white mb-2">
              Texto
            </label>
            <textarea
              id="text-input"
              ref={textareaRef}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              onInput={adjustTextareaHeight}
              className="w-full bg-white bg-opacity-20 rounded-md p-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Escribe algo aquí..."
              rows={4}
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleTranslate}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
            >
              {loading ? "Traduciendo..." : "Traducir"}
            </button>
            <button
              onClick={handleProcessText}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Procesar Texto"}
            </button>
          </div>

          <div className="bg-white bg-opacity-20 rounded-md p-4">
       
            <ReactMarkdown className="text-white">
        {apiResult || "El resultado aparecerá aquí..."}
      </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

