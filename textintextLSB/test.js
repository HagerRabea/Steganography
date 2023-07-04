// // Encoding function
// function encodeMessage(coverText, secretMessage) {
//     let encodedText = '';
  
//     // Convert secret message to binary
//     const binaryMessage = secretMessage
//       .split('')
//       .map((char) => char.charCodeAt().toString(2).padStart(8, '0'))
//       .join('');
  
//     let messageIndex = 0;
  
//     // Traverse through the cover text
//     for (let i = 0; i < coverText.length; i++) {
//       let coverChar = coverText[i];
//       let binaryChar = coverChar.charCodeAt().toString(2).padStart(8, '0');
  
//       // Check if there are remaining bits to encode
//       if (messageIndex < binaryMessage.length) {
//         // Replace the least significant bit of the cover character with the secret message bit
//         const encodedChar = binaryChar.slice(0, 7) + binaryMessage[messageIndex];
//         const encodedCharCode = parseInt(encodedChar, 2);
//         encodedText += String.fromCharCode(encodedCharCode);
//         messageIndex++;
//       } else {
//         encodedText += coverChar;
//       }
//     }
//     return encodedText;
//   }
  
//   // Decoding function
//   function decodeMessage(encodedText) {
//     let decodedMessage = '';
//     let binaryMessage = '';
  
//     // Traverse through the encoded text
//     for (let i = 0; i < encodedText.length; i++) {
//       const encodedChar = encodedText[i];
//       const binaryChar = encodedChar.charCodeAt().toString(2).padStart(8, '0');
  
//       // Extract the least significant bit from the encoded character
//       const secretBit = binaryChar.slice(-1);
//       binaryMessage += secretBit;
  
//       // Check if a complete byte has been gathered
//       if (binaryMessage.length === 8) {
//         // Convert the binary byte to decimal and then to its corresponding character
//         const secretCharCode = parseInt(binaryMessage, 2);
//         const secretChar = String.fromCharCode(secretCharCode);
//         decodedMessage += secretChar;
  
//         binaryMessage = '';
//       }
//     }
  
//     return decodedMessage;
//   }
//   // Example usage
//   const coverText = "Lorem ipsum dolor sit amet";
//   const secretMessage = "Hello, world!";
  
//   // Encoding
//   const encodedText = encodeMessage(coverText, secretMessage);
//   console.log("Encoded text:", encodedText);
  
//   // Decoding
//   const decodedMessage = decodeMessage(encodedText);
//   console.log("Decoded message:", decodedMessage);
// Get the HTML elements
const coverTextInput = document.getElementById('coverText');
const secretMessageInput = document.getElementById('secretMessage');
const embeddedMessageInput = document.getElementById('embeddedMessage');

// Encoding function
function encodeMessage(coverText, secretMessage) {
  let encodedText = '';

  // Convert secret message to binary
  const binaryMessage = secretMessage
    .split('')
    .map((char) => char.charCodeAt().toString(2).padStart(8, '0'))
    .join('');

  let messageIndex = 0;

  // Traverse through the cover text
  for (let i = 0; i < coverText.length; i++) {
    let coverChar = coverText[i];
    let binaryChar = coverChar.charCodeAt().toString(2).padStart(8, '0');

    // Check if there are remaining bits to encode
    if (messageIndex < binaryMessage.length) {
      // Replace the least significant bit of the cover character with the secret message bit
      const encodedChar = binaryChar.slice(0, 7) + binaryMessage[messageIndex];
      const encodedCharCode = parseInt(encodedChar, 2);
      encodedText += String.fromCharCode(encodedCharCode);
      messageIndex++;
    } else {
      encodedText += coverChar;
    }
  }
  return encodedText;
}

// Decoding function
function decodeMessage(encodedText) {
  let decodedMessage = '';
  let binaryMessage = '';

  // Traverse through the encoded text
  for (let i = 0; i < encodedText.length; i++) {
    const encodedChar = encodedText[i];
    const binaryChar = encodedChar.charCodeAt().toString(2).padStart(8, '0');

    // Extract the least significant bit from the encoded character
    const secretBit = binaryChar.slice(-1);
    binaryMessage += secretBit;

    // Check if a complete byte has been gathered
    if (binaryMessage.length === 8) {
      // Convert the binary byte to decimal and then to its corresponding character
      const secretCharCode = parseInt(binaryMessage, 2);
      const secretChar = String.fromCharCode(secretCharCode);
      decodedMessage += secretChar;

      binaryMessage = '';
    }
  }

  return decodedMessage;
}

// Embed message function
function embedMessage() {
  const coverText = coverTextInput.value;
  const secretMessage = secretMessageInput.value;
  const embeddedMessage = encodeMessage(coverText, secretMessage);
  embeddedMessageInput.value = embeddedMessage;
}

// Show message function
function showMessage() {
  const embeddedMessage = embeddedMessageInput.value;
  const decodedMessage = decodeMessage(embeddedMessage);
  alert(decodedMessage);
}