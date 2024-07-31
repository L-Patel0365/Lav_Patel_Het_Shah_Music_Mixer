document.addEventListener("DOMContentLoaded", () => {
  console.log("Javascript is connected");

  const dropZone = document.getElementById("drop-zone");
  const dropZoneImage = dropZone.querySelector("img");
  const backButton = document.getElementById("backButton");
  const resetButton = document.getElementById("resetButton");
  const audioElement = document.getElementById("audio");
  const playButton = document.getElementById("playButton");
  const pauseButton = document.getElementById("pauseButton");
  const volumeControl = document.querySelector(".volume-control");
  const forwardButton = document.querySelector(".fa-forward");
  const backwardButton = document.querySelector(".fa-backward");
  let dropHistory = [];
  let currentTrackIndex = -1;
  let tracks = [];

  // Add event listeners for drag and drop
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.border = "3px solid #fff";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.border = "";
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const cdPieceId = e.dataTransfer.getData("text");
    const cdElement = document.getElementById(cdPieceId);
    const cdImageSrc = cdElement.querySelector("img").src;

    // Save the current state to history for the undo feature
    dropHistory.push({
      imageSrc: dropZoneImage.src,
      audioSrc: audioElement.src,
    });

    // Set the drop zone image src to the dragged CD piece image src
    dropZoneImage.src = cdImageSrc;
    dropZone.style.border = "";

    // Play the music associated with the dropped CD piece
    const newAudioSrc = cdElement.getAttribute("data-audio-src");
    if (newAudioSrc) {
      audioElement.src = newAudioSrc;
      audioElement.play();
      // Update the track index
      currentTrackIndex = tracks.findIndex(
        (track) => track.audioSrc === newAudioSrc
      );
      if (currentTrackIndex === -1) {
        tracks.push({ cdImageSrc, audioSrc: newAudioSrc });
        currentTrackIndex = tracks.length - 1;
      }
    }
  });

  // Add event listeners for dragstart on CD pieces
  const cdPieces = document.querySelectorAll(".cd-unit");
  cdPieces.forEach((cdPiece) => {
    cdPiece.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text", cdPiece.id);
    });
  });

  // Event listener for the reset button
  resetButton.addEventListener("click", () => {
    location.reload(); // Reload the page to reset it
  });

  // Event listener for the back button
  backButton.addEventListener("click", () => {
    if (dropHistory.length > 0) {
      const lastState = dropHistory.pop();
      dropZoneImage.src = lastState.imageSrc;
      audioElement.src = lastState.audioSrc;
      if (lastState.audioSrc) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    }
  });

  // Event listeners for play and pause buttons
  playButton.addEventListener("click", () => {
    audioElement.play();
  });

  pauseButton.addEventListener("click", () => {
    audioElement.pause();
  });

  // Event listener for volume control
  volumeControl.addEventListener("input", (e) => {
    audioElement.volume = e.target.value / 100;
  });

  // Event listener for forward button
  forwardButton.addEventListener("click", () => {
    if (tracks.length > 0) {
      currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
      const nextTrack = tracks[currentTrackIndex];
      dropZoneImage.src = nextTrack.cdImageSrc;
      audioElement.src = nextTrack.audioSrc;
      audioElement.play();
    }
  });

  // Event listener for backward button
  backwardButton.addEventListener("click", () => {
    if (tracks.length > 0) {
      currentTrackIndex =
        (currentTrackIndex - 1 + tracks.length) % tracks.length;
      const prevTrack = tracks[currentTrackIndex];
      dropZoneImage.src = prevTrack.cdImageSrc;
      audioElement.src = prevTrack.audioSrc;
      audioElement.play();
    }
  });
});
