
var loadFile = document.getElementById('loadFile');
var secret = document.getElementById('secret');
var coverAfter = document.getElementById('coverAfter');
var ctxSecret = secret.getContext('2d', { willReadFrequently: true });
var myFile = document.getElementById('myFile');
var view;
var clampedArray;
var index = 0;
var ctxCoverAfter = coverAfter.getContext('2d');

let video;
let canvas;
let context;
let intervalId;
var arrayBuffer;
var text;

myFile.addEventListener('change', function (e) {
  const file = myFile.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    text = reader.result;
    console.log(text);
  };
  reader.readAsText(file);
});

const inputFile = document.getElementById('video-file');
inputFile.addEventListener('change', function () {
  playVideo();
});

function playVideo() {
  const videoFile = document.getElementById('video-file').files[0];
  video = document.createElement('video');

  if (!videoFile) {
    console.error('No video file selected');
    return;
  }

  video.addEventListener('error', function () {
    console.error('Error loading video');
  });

  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d', { willReadFrequently: true });
  intervalId = setInterval(function () {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  }, 16);

  video.addEventListener('loadeddata', function () {
    const bits = 2;
    const binaryText = text.split('').map((char) =>
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('');
    const totalBits = binaryText.length;
    const maxBitsPerFrame = ((canvas.width * canvas.height * bits) / 8) - 4;
    const frameRate = video.captureStream().getVideoTracks()[0].getSettings().frameRate;
    const totalFrames = Math.floor(video.duration * frameRate);

    if (totalFrames * maxBitsPerFrame < totalBits) {
      console.error('The video is not long enough to hide the text.');
      return;
    }

    for (let i = 0; i < totalFrames; i++) {
      video.currentTime = i / frameRate;
      const pixelData = context.getImageData(0, 0, canvas.width, canvas.height);
      const startIndex = (i * maxBitsPerFrame * 8) + 4;
      
      for (let j = 0; j < maxBitsPerFrame && startIndex + j * 8 < pixelData.data.length; j++) {
        const byteIndex = startIndex + j * 8;
        let byte = pixelData.data[byteIndex];
        
        for (let k = 0; k < bits; k++) {
          if (byteIndex + k < pixelData.data.length) {
            byte &= ~(1 << k);
            const bitValue = binaryText.charAt(k + j * bits);
            byte |= bitValue << k;
          }
        }
        
        pixelData.data[byteIndex] = byte;
      }
      
      intervalId = setInterval(() => {
        ctxSecret.putImageData(pixelData, 0, 0);
      }, 16);
    }
  });

  video.src = window.URL.createObjectURL(videoFile);
  video.play();
}

loadFile.addEventListener('change',function (){

  const videoFile2 = document.getElementById('loadFile').files[0];
const video = document.createElement('video');
video.src = URL.createObjectURL(videoFile2);
video.play();

// Wait for the metadata to load
video.onloadedmetadata = () => {

  frameRate=video.captureStream().getVideoTracks()[0].getSettings().frameRate;

  // Set the number of bits used for hiding the text
  const bits = 2;

  // Get the total number of frames in the video
  const totalFrames = Math.floor(video2.duration * frameRate);

  // Get the maximum number of bits that can be extracted from each frame
  const maxBitsPerFrame = ((canvas.width * canvas.height * bits) / 8) - 4;

  // Create an array to store the extracted bits
  const extractedBits = [];

  // Loop through each frame of the video
  for (let i = 0; i < totalFrames; i++) {
    // Set the current time of the video to get the next frame
    video.currentTime = i / frameRate;

    // Draw the current frame on the canvas
    ctxCoverAfter.drawImage(video, 0, 0, coverAfter.width, coverAfter.height);

    // Get the pixel data of the current frame
    const pixelData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Get the index of the first byte where the text is hidden
    const startIndex = (i * maxBitsPerFrame * 8) + 4;

    // Extract the text from the pixel data
    for (let j = 0; j < maxBitsPerFrame && startIndex + j * 8 < pixelData.data.length; j++) {
      // Get the index of the current byte
      const byteIndex = startIndex + j * 8;

      // Extract the bits from the current byte
      let byte = 0;
      for (let k = 0; k < bits; k++) {
        // Check if the current bit is hidden in the current byte
        if (byteIndex + k < pixelData.data.length) {
          // Get the value of the current bit
          const bitValue = (pixelData.data[byteIndex + k] & 1) << k;

          // Set the value of the current bit in the current byte
          byte |= bitValue;
        }
      }

      // Add the extracted byte to the array of extracted bits
      extractedBits.push(byte);
    }
  }

  // Convert the extracted bits to text
  const binaryText = extractedBits.map((byte) => byte.toString(2).padStart(8, '0')).join('');
  console.log(binaryText);
  const text = binaryToText(binaryText);
   console.log(text)
  // Download the extracted text as a text file
  downloadTextFile(text, 'hidden_text.txt');
};
});






function pauseVideo() {
  if (video) {
    video.pause();
    clearInterval(intervalId);
  }
}

// Function to convert binary to text
function binaryToText(binary) {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    text += String.fromCharCode(parseInt(binary.substr(i, 8), 2));
  }
  return text;
}

// Function to force download a text file
function downloadTextFile(text, fileName) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}












// var
//     loadFile = document.getElementById( 'loadFile' ),
//     secret =  document.getElementById( 'secret' ),
//     coverAfter = document.getElementById( 'coverAfter' ),
//     ctxSecret = secret.getContext( '2d',{willReadFrequently:true}),
//     myFile = document.getElementById( 'myFile' ),
//     view,
//     clampedArray,
//     index = 0,
//     ctxCoverAfter = coverAfter.getContext( '2d' );

// let video;
// let canvas;
// let context;
// let intervalId;
// var arrayBuffer;
// var text;
// myFile.addEventListener( 'change', function ( e ) {
//   const file = myFile.files[0];
//   // Create a new FileReader object
//   const reader = new FileReader();
//   // Set up the onload event handler to handle when the file is loaded
//   reader.onload = function() {
//     // Get the contents of the file as a string
//      text = reader.result;
//     // Do something with the text
//     console.log(text);
//   };
//   // Read the file as text
//   reader.readAsText(file);
// });

// const inputFile = document.getElementById('video-file');
// inputFile.addEventListener('change',function(){
//   playVideo();
// })
// function playVideo(){
//   const videoFile = document.getElementById('video-file').files[0];
//   const video = document.createElement('video');
//   //   video.src = URL.createObjectURL(videoFile);
//   //   video.preload = 'metadata'
   
//   if (!videoFile) {
//     console.error('No video file selected');
//     return;
//   }
//   //  video = document.createElement('video');

//   video.addEventListener('error', function() {
//     console.error('Error loading video');
//   });
  
//   canvas = document.getElementById('canvas');
//   context = canvas.getContext('2d',{willReadFrequently:true});
//   intervalId = setInterval(function() {
//     context.drawImage(video, 0, 0,  canvas.width,canvas.height);
//    } ,16);
//   video.src = window.URL.createObjectURL(videoFile);
//   console.log(video.src)
//   video.play();
//   var pixelData;

//   video.addEventListener('loadeddata', function() {
//     // console.log("test5")
   
    
//       //  context.drawImage(video, 0, 0,  canvas.height,canvas.width);
//       const bits = 2; // You can change this value as per your requirements
  
//       // Convert the text to binary
//       const binaryText = text.split('').map((char) => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
//   // console.log(binaryText)
//       // Get the total number of bits required to store the text
//       const totalBits = binaryText.length;
//   // console.log(totalBits)
//       // Calculate the maximum number of bits that can be hidden in each frame
//       const maxBitsPerFrame = ((canvas.width * canvas.height * bits) / 8) - 4;
//       // console.log(maxBitsPerFrame);
//       // Check if the video is long enough to hide the text
//       frameRate=video.captureStream().getVideoTracks()[0].getSettings().frameRate;
//     //  console.log(frameRate);
//       const totalFrames = Math.floor(video.duration * frameRate);
      
//       console.log(totalFrames)
//       if (totalFrames * maxBitsPerFrame < totalBits) {
//         console.error('The video is not long enough to hide the text.');
//         return;
//       }
  
//       // Loop through each frame of the video
//       for (let i = 0; i < totalFrames; i++) {
//         // Set the current time of the video to get the next frame
//         video.currentTime = i / frameRate;
//       // console.log(video.currentTime)
//         // Draw the current frame on the canvas
//         //  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
//         // Get the pixel data of the current frame
//          pixelData = context.getImageData(0, 0, canvas.width, canvas.height);
//         // console.log(pixelData);
//         // Get the index of the first byte where the text can be hidden
//         const startIndex = (i * maxBitsPerFrame * 8) + 4;
//             // console.log(startIndex);
//         // Hide the text in the pixel data
//         for (let j = 0; j < maxBitsPerFrame && startIndex + j * 8 < pixelData.data.length; j++) {
//           // Get the index of the current byte
//           const byteIndex = startIndex + j * 8;
  
//           // Get the current byte
//           let byte = pixelData.data[byteIndex];
  
//           // Hide the text in the current byte
//           for (let k = 0; k < bits; k++) {
//             // Get the index of the current bit
//             const bitIndex = k + j * bits;
  
//             // Check if the current bit can be hidden in the current byte
//             if (byteIndex + k < pixelData.data.length) {
//               // Clear the least significant bit of the current byte
//               byte &= ~(1 << k);
  
//               // Get the value of the current bit from the text
//               const bitValue = binaryText.charAt(bitIndex);
//             // console.log(bitValue)
//               // Set the least significant bit of the current byte to the value of the current bit
//               byte |= bitValue << k;
//             }
//           }
  
//           // Update the current byte in the pixel data
//           pixelData.data[byteIndex] = byte;
//           // context.putImageData(pixelData, 0, 0);
//         }
  
//         // Put the modified pixel data back on the canvas
//         intervalId=setInterval(() => {
//           ctxSecret.putImageData(pixelData, 0, 0);
//         }, 16);
//           //  context.putImageData(pixelData, 0, 0);
//           //  console.log(pixelData);
//       }
      
   
//   });

// }

// loadFile.addEventListener('change',function (){

//   const videoFile2 = document.getElementById('loadFile').files[0];
// const video = document.createElement('video');
// video.src = URL.createObjectURL(videoFile2);
// video.play();

// // Wait for the metadata to load
// video.onloadedmetadata = () => {

//   frameRate=video.captureStream().getVideoTracks()[0].getSettings().frameRate;

//   // Set the number of bits used for hiding the text
//   const bits = 2;

//   // Get the total number of frames in the video
//   const totalFrames = Math.floor(video2.duration * frameRate);

//   // Get the maximum number of bits that can be extracted from each frame
//   const maxBitsPerFrame = ((canvas.width * canvas.height * bits) / 8) - 4;

//   // Create an array to store the extracted bits
//   const extractedBits = [];

//   // Loop through each frame of the video
//   for (let i = 0; i < totalFrames; i++) {
//     // Set the current time of the video to get the next frame
//     video.currentTime = i / frameRate;

//     // Draw the current frame on the canvas
//     ctxCoverAfter.drawImage(video, 0, 0, coverAfter.width, coverAfter.height);

//     // Get the pixel data of the current frame
//     const pixelData = context.getImageData(0, 0, canvas.width, canvas.height);

//     // Get the index of the first byte where the text is hidden
//     const startIndex = (i * maxBitsPerFrame * 8) + 4;

//     // Extract the text from the pixel data
//     for (let j = 0; j < maxBitsPerFrame && startIndex + j * 8 < pixelData.data.length; j++) {
//       // Get the index of the current byte
//       const byteIndex = startIndex + j * 8;

//       // Extract the bits from the current byte
//       let byte = 0;
//       for (let k = 0; k < bits; k++) {
//         // Check if the current bit is hidden in the current byte
//         if (byteIndex + k < pixelData.data.length) {
//           // Get the value of the current bit
//           const bitValue = (pixelData.data[byteIndex + k] & 1) << k;

//           // Set the value of the current bit in the current byte
//           byte |= bitValue;
//         }
//       }

//       // Add the extracted byte to the array of extracted bits
//       extractedBits.push(byte);
//     }
//   }

//   // Convert the extracted bits to text
//   const binaryText = extractedBits.map((byte) => byte.toString(2).padStart(8, '0')).join('');
//   console.log(binaryText);
//   const text = binaryToText(binaryText);
//    console.log(text)
//   // Download the extracted text as a text file
//   downloadTextFile(text, 'hidden_text.txt');
// };
// });






// function pauseVideo() {
//   if (video) {
//     video.pause();
//     clearInterval(intervalId);
//   }
// }



// // Function to convert binary to text
// function binaryToText(binary) {
//   let text = '';
//   for (let i = 0; i < binary.length; i += 8) {
//     text += String.fromCharCode(parseInt(binary.substr(i, 8), 2));
//   }
//   return text;
// }

// // Function to force download a text file
// function downloadTextFile(text, fileName) {
//   const blob = new Blob([text], { type: 'text/plain' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = fileName;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// }

