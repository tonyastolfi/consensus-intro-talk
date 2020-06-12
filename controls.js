let paused = false;
let scrubbing = false;
let play_pause_button = document.querySelector('#play_pause');
play_pause_button.onclick = function() {
  paused = !paused;
  if (paused) {
    play_pause_button.src = "icons/play-fill.svg";
    animation.pause();
  } else {
    play_pause_button.src = "icons/pause-fill.svg";
    animation.play();
  }
};

var progress_slider = document.querySelector('#controls .progress');
progress_slider.onmousedown = function() {
  scrubbing = true;
  animation.pause();
};
progress_slider.onmouseup = function() {
  scrubbing = false;
  if (!paused) {
    animation.play();
  }
};
progress_slider.addEventListener('input', function() {
  animation.seek(animation.duration * (progress_slider.value / 100));
});
