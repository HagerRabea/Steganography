// Constants
const BLOCK_SIZE = 2;
const THRESHOLD = 10;

// Embed message in cover image using PVD algorithm
function embedMessage() {
  // Get elements
  const coverImage = document.getElementById('cover-image');
  const stegoImage = document.getElementById('stego-image-embed');
  const coverImageFile = document.getElementById('cover-image-file');
  const message = document.getElementById('message').value;
  const password = document.getElementById('password').value;

  // Check for empty fields
  if (coverImageFile.files.length === 0 || message === '' || password === '') {
    alert('Please fill all fields');
    return;
  }

  // Create file reader
  const reader = new FileReader();

  // Define onload function for file reader
  reader.onload = function() {
    // Create image object
    const image = new Image();

    // Define onload function for image object
    image.onload = function() {
      // Create canvas and get context
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');

      // Draw cover image on canvas
      context.drawImage(image, 0, 0);

      // Get image data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Encode message
      const encodedMessage = encodeMessage(message, password);

      // Check if message can fit in image
      if (encodedMessage.length > pixels.length / (BLOCK_SIZE * 8) - 1) {
        alert('Message is too long to embed in image');
        return;
      }

      // Embed message in pixel values
      let messageIndex = 0;
      for (let i = 0; i < pixels.length; i += BLOCK_SIZE * 4) {
        // Calculate pixel value difference (delta)
        const delta = Math.abs(pixels[i] - pixels[i+4]);

        // Check if delta is less than threshold
        if (delta <= THRESHOLD) {
          // Get next bit of message
          const messageBit = encodedMessage[messageIndex];

          // Embed bit in pixel values
          if (pixels[i] < pixels[i+4]) {
            pixels[i] += (messageBit === '1' ? -1 :1) * Math.floor(delta / 2);
          } else {
            pixels[i] -= (messageBit === '1' ? -1 : 1) * Math.floor(delta / 2);
          }

          // Increment message index
          messageIndex++;

          // Check if message is fully embedded
          if (messageIndex === encodedMessage.length) {
            break;
          }
        }
      }

      // Update canvas with stego image data
      context.putImageData(imageData, 0, 0);

      // Set cover image source
      coverImage.src = reader.result;

      // Set stego image source
      stegoImage.src = canvas.toDataURL();

      // Clear form inputs
      coverImageFile.value = '';
      document.getElementById('message').value = '';
      document.getElementById('password').value = '';
    };

    // Set image source to cover image file
    image.src = reader.result;
  };

  // Read cover image file as data URL
  reader.readAsDataURL(coverImageFile.files[0]);
}

// Extract message from stego image using PVD algorithm
function extractMessage() {
  // Get elements
  const stegoImage = document.getElementById('stego-image-extract');
  const stegoImageFile = document.getElementById('stego-image-file');
  const password = document.getElementById('password2').value;
  const extractedMessage = document.getElementById('extracted-message');

  // Check for empty fields
  if (stegoImageFile.files.length === 0 || password === '') {
    alert('Please fill all fields');
    return;
  }

  // Create file reader
  const reader = new FileReader();

  // Define onload function for file reader
  reader.onload = function() {
    // Create image object
    const image = new Image();

    // Define onload function for image object
    image.onload = function() {
      // Create canvas and get context
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');

      // Draw stego image on canvas
      context.drawImage(image, 0, 0);

      // Get image data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Extract message from pixel values
      let encodedMessage = '';
      for (let i = 0; i < pixels.length; i += BLOCK_SIZE * 4) {
        // Calculate pixel value difference (delta)
        const delta = Math.abs(pixels[i] - pixels[i+4]);

        // Check if delta is less than threshold
        if (delta <= THRESHOLD) {
          // Extract bit from pixel values
          if (pixels[i] < pixels[i+4]) {
            encodedMessage += '1';
          } else {
            encodedMessage += '0';
          }
        }
      }

      // Decode message
      const message = decodeMessage(encodedMessage, password);

      // Set stego image source
      stegoImage.src = reader.result;

      // Display extracted message
      extractedMessage.innerText = message;

      // Clear form inputs
      stegoImageFile.value = '';
      document.getElementById('password2').value = '';
    };

    // Set image source to stego image file
    image.src = reader.result;
  };

  // Read stego image file as data URL
  reader.readAsDataURL(stegoImageFile.files[0]);
}

// Encode message using Vigenere cipher
function encodeMessage(message, password) {
  let encodedMessage = '';

  for (let i = 0; i < message.length; i++) {
    const messageCharCode = message.charCodeAt(i);
    const passwordCharCode = password.charCodeAt(i % password.length);
    const encodedCharCode = (messageCharCode + passwordCharCode) % 256;
    encodedMessage += String.fromCharCode(encodedCharCode);
  }

  return encodedMessage;
}

// Decode message using Vigenere cipher
function decodeMessage(encodedMessage, password) {
  let message = '';

  for (let i = 0; i < encodedMessage.length; i++) {
    const encodedCharCode = encodedMessage.charCodeAt(i);
    const passwordCharCode = password.charCodeAt(i % password.length);
    const messageCharCode = (encodedCharCode - passwordCharCode + 256) % 256;
    message += String.fromCharCode(messageCharCode);
  }

  return message;
}