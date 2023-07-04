function embedMessage() {
    const coverImageEl = document.getElementById("cover-image");
    const stegoImageEl = document.getElementById("stego-image");
    const passwordEl = document.getElementById("password");
    const messageEl = document.getElementById("message");
    const password = passwordEl.value;
    const message = messageEl.value;

    if (!password || !message) {
      alert("Please enter a password and message to embed!");
      return;
    }

    const reader = new FileReader();
    reader.onload = function() {
      const coverImage = new Image();
      coverImage.onload = function() {
        const stegoImage = embedMessageInImage(message, coverImage, password);
        stegoImageEl.src = stegoImage.src;
      }
      coverImage.src = reader.result;
    }
    reader.readAsDataURL(coverImageEl.files[0]);
  }

  function extractMessageFromImage(stegoImage, password) {
    // F5 algorithm implementation goes here
  }

  function embedMessageInImage(message, coverImage, password) {
    // F5 algorithm implementation goes here
    const stegoCanvas = document.createElement("canvas");
    const stegoContext = stegoCanvas.getContext("2d");
    stegoCanvas.width = coverImage.width;
    stegoCanvas.height = coverImage.height;
    stegoContext.drawImage(coverImage, 0, 0);
    const imageData = stegoContext.getImageData(0, 0, coverImage.width, coverImage.height);
    const encodedMessage = encodeMessage(message, password);
    if (encodedMessage.length > imageData.data.length / 8) {
      alert("Message is too long to embed in this image!");
      return;
    }
    for (let i = 0; i < encodedMessage.length; i++) {
      const binaryCharCode = encodedMessage[i].charCodeAt(0).toString(2).padStart(8, "0");
      for (let j = 0; j < binaryCharCode.length; j++) {
        const pixelIndex = i * 8 + j;
        const pixelDataIndex = pixelIndex * 4;
        const bitToEmbed = binaryCharCode.charAt(j);
        if (bitToEmbed === "0" && imageData.data[pixelDataIndex] % 2 !== 0) {
          imageData.data[pixelDataIndex] -= 1;
        } else if (bitToEmbed === "1" && imageData.data[pixelDataIndex] % 2 === 0) {
          imageData.data[pixelDataIndex] += 1;
        }
      }
    }
    stegoContext.putImageData(imageData, 0, 0);
    const stegoImage = new Image();
    stegoImage.src = stegoCanvas.toDataURL();
    return stegoImage;
  }

  function encodeMessage(message, password) {
    const encodedMessage = password + message;
    return encodedMessage;
  }

  document.getElementById("embed-btn").addEventListener("click", embedMessage);


  function extractMessage() {
const stegoImageEl = document.getElementById("stego-image");
const passwordEl = document.getElementById("password");
const password = passwordEl.value;
const stegoImage = new Image();
stegoImage.onload = function(){
const message = extractMessageFromImage(stegoImage, password);
const messageEl = document.getElementById("extracted-message");
messageEl.value = message;
};
stegoImage.src = stegoImageEl.src;
}

function extractMessageFromImage(stegoImage, password) {
const stegoCanvas = document.createElement("canvas");
const stegoContext = stegoCanvas.getContext("2d");
stegoCanvas.width = stegoImage.width;
stegoCanvas.height = stegoImage.height;
stegoContext.drawImage(stegoImage, 0, 0);
const imageData = stegoContext.getImageData(0, 0, stegoImage.width, stegoImage.height);
let binaryMessage = "";
let messageLength = 0;
for (let i = 0; i < imageData.data.length; i += 32) {
const pixelDataIndex = i;
let binaryCharCode = "";
for (let j = 0; j < 8; j++) {
  const pixelIndex = i / 4 + j;
  const bitToExtract = imageData.data[pixelIndex * 4] % 2;
  binaryCharCode += bitToExtract;
}
const charCode = parseInt(binaryCharCode, 2);
const char = String.fromCharCode(charCode);
if (i === 0) {
  if (char !== password.charAt(0)) {
    alert("Incorrectpassword!");
    return;
  }
  messageLength = parseInt(password.substring(1));
  if (messageLength > (imageData.data.length / 32) - 1) {
    alert("Message is too long to extract from this image!");
    return;
  }
} else {
  binaryMessage += binaryCharCode;
}
if (binaryMessage.length === messageLength * 8) {
  break;
}
}
const message = decodeMessage(binaryMessage);
return message;
}

function decodeMessage(binaryMessage) {
let message = "";
for (let i = 0; i < binaryMessage.length; i += 8) {
const binaryCharCode = binaryMessage.substring(i, i + 8);
const charCode = parseInt(binaryCharCode, 2);
const char = String.fromCharCode(charCode);
message += char;
}
return message;
}

document.getElementById("extract-btn").addEventListener("click", extractMessage);
