// Copyright 2020 Tony Astolfi
//
let keys = ['A','B','C','X','Y','Z'];
let vals = [0, 1, 2, 3, 4, 5, 6, 7];
let log = [];
let states = [{}];
let state = {};
let log_frames = [];
let sm_frames = [];
let sm_obj = {lsn: 0};

for (i=0; i<100; ++i) {
  let k = keys[Math.floor(keys.length * Math.random())];
  let v = vals[Math.floor(vals.length * Math.random())];
  state[k] = [v, i];
  $('#log').append("<div class='log_slot' id='slot_" + i.toString() +
                   "'><div class='message'>" + k.toString() + ": " +
                   v.toString() + "</div><div class='slot_label'>slot_" +
                   i.toString() + "</div></div>");
  log.push({key: k, val: v});
  states.push({...state});
  log_frames.push({
    translateX: -90 * (i + 1),
    delay: 1000,
    duration: 500,
  });
}

let step_delay = 1000;
let feed_delay = 3000;

function update_state() {
  let feed_progress = feed_delay * 100 / animation.duration;
  console.log('feed_progress: ' + feed_progress);
  console.log('progress: ' + animation.progress);
  let lsn = Math.floor((animation.progress - feed_progress) * animation.duration / (animation.duration - feed_delay) + 0.3);
  console.log('update called: ' + lsn);
  let src = 
      "<table class='kvstore'><thead><td>Key</td><td>Value</td><td>LastModified</td></thead>";
  for (const k in states[lsn]) {
    src += "<tr><td>" + k.toString() + "</td><td>"
      + states[lsn][k][0] + "</td><td class='slot_label'>slot_"
      + states[lsn][k][1] + "</td></tr>";
  }
  src += "</table>";
  document.getElementById("statemachine").innerHTML = src;
}

$("#statemachine").css({opacity: 0});
$(".slot_label").css({opacity: 0});
$(".log_slot").css({opacity: 0});
$("#slot_0").css({opacity: 1});

let prev_lsn = 0;
let animation = anime.timeline({
      update: function() {
        update_state();
        if (!scrubbing) {
          progress_slider.value = animation.progress;
        }
      },
})
    .add({
      targets: '.slot_label',
      easing: "linear",
      opacity: 1,
      duration: 150,
    }, 1.5 * step_delay)
    .add({
      targets: '#statemachine',
    easing: "linear",
      opacity: 1,
      duration: 150,
    }, 3 * step_delay)
    .add({
      targets: '#log',
      keyframes: log_frames,
    }, feed_delay);

for (var i=1; i<100; ++i) {
  animation.add({
    targets: '#slot_' + i.toString(),
    easing: "linear",
    opacity: 1,
    duration: 150,
  }, i * 25);
}

animation.pause();
update_state();
