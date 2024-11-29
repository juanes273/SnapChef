const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
  }

  const filePath = req.file.path; // Ruta temporal del archivo

  const form = new FormData();
  form.append('image', fs.createReadStream(filePath));

  const headers = {
    ...form.getHeaders(),
    'Authorization': 'Api-Key gV6yGJWy.dK7KH9qrDwkbAMJnbJljcTl2vtL1w96m',
  };

  axios.post('https://vision.foodvisor.io/api/1.0/en/analysis/', form, { headers })
    .then((response) => {
      const items = response.data?.items || [];

      // Procesar y concatenar los resultados en un solo string
      const filteredItems = items
        .map((item) => {
          const highestConfidenceFood = item.food.reduce((max, foodItem) => {
            return foodItem.confidence > max.confidence ? foodItem : max;
          });

          let foodInfo = highestConfidenceFood.food_info.display_name;
          if (highestConfidenceFood.ingredients?.length > 0) {
            foodInfo +=
              ', ' +
              highestConfidenceFood.ingredients
                .map((ingredient) => ingredient.food_info.display_name)
                .join(', ');
          }

          return foodInfo;
        })
        .join(', '); // Unir los elementos con comas

      res.json({ items: filteredItems });
      console.log(filteredItems)
    })
    .catch((error) => {
      console.error('Error al procesar la imagen:', error.response?.data || error.message);
      res.status(500).json({ message: 'Error al procesar la imagen' });
    })
    .finally(() => {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error al eliminar el archivo temporal:', err);
      });
    });
};

module.exports = { uploadImage };
