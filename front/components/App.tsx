'use client';

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImportIcon as Translate, FileText, ImageIcon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function ImageProcessor() {
  const [responseText, setResponseText] = useState("");
  const [apiResult, setApiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    adjustTextareaHeight();
  }, [responseText]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast.error("Please select an image first");
      return;
    }
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
      toast.success("Image processed successfully");
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Error processing image");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!responseText) {
      toast.error("Please enter some text to translate");
      return;
    }
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
        toast.success("Text translated successfully");
      } else {
        console.error("Error translating text");
        toast.error("Error translating text");
      }
    } catch (error) {
      console.error("Error translating:", error);
      toast.error("Error translating text");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessText = async () => {
    if (!responseText) {
      toast.error("Please enter some text to process");
      return;
    }
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
        toast.success("Text processed successfully");
      } else {
        console.error("No valid result received from API");
        toast.error("Error processing text");
      }
    } catch (error) {
      console.error("Error calling API:", error);
      toast.error("Error processing text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4 font-poppins">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-blue-100 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-8 max-w-2xl w-full"
      >
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Image and Text Processor</h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-white mb-2">
              Upload Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFileName(file.name);
                }}
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-white bg-opacity-20 rounded-md text-white cursor-pointer hover:bg-opacity-30 transition duration-300 flex items-center space-x-2"
              >
                <Upload size={18} />
                <span>{fileName || "Select file"}</span>
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 flex items-center space-x-2"
              >
                <ImageIcon size={18} />
                <span>{loading ? "Processing..." : "Upload Image"}</span>
              </motion.button>
            </div>
          </div>

          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-white mb-2">
              Text
            </label>
            <textarea
              id="text-input"
              ref={textareaRef}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full bg-white bg-opacity-20 rounded-md p-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              placeholder="Write something here..."
              rows={4}
            />
          </div>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTranslate}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Translate size={18} />
              <span>{loading ? "Translating..." : "Translate"}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProcessText}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <FileText size={18} />
              <span>{loading ? "Processing..." : "Process Text"}</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {apiResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white bg-opacity-20 rounded-md p-4"
              >
                <ReactMarkdown className="text-white prose prose-invert">
                  {apiResult}
                </ReactMarkdown>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <Toaster position="bottom-center" />
    </div>
  );
}

