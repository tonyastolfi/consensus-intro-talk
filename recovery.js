let canvas = document.getElementById('backdrop');
let show_invars = false;
let protocol_card = document.getElementById('protocol');
protocol_card.onclick = function() {
  show_invars = !show_invars;
  if (show_invars) {
    $(protocol_card).css({
      opacity: 1,
    });
  } else {
    $(protocol_card).css({
      opacity: 0,
    });
  }
}

let s_blur = [{vl: 0}, {vl: 0}, {vl: 0}, {vl: 0}, {vl: 0}, {vl: 0}];

let ex = [0];
for (var e=1; e<= 5; ++e) {
  ex.push(document.querySelector("#epoch" + e.toString() + "_elem").getBoundingClientRect().x);
}

let step_delay = 750;

let animation = anime.timeline({
  easing: "linear",
  update: function() {
    progress_slider.value = animation.progress;
    for (var i=1; i<=5; ++i) {
      $('.s' + i.toString() + "_row").css({filter: "blur(" + s_blur[i].vl.toString() + "px)"});
    }
  },
})
// 1
    .add({
      targets: "#s1_leader",
      "border-color": "#000",
      duration: 100,
    }, 0 * step_delay)
// 2
    .add({
      targets: "#s1_x4",
      opacity: 1,
      duration: 100,
    }, 1 * step_delay)
// 3
    .add({
      targets: s_blur[1],
      vl: 5,
      duration: 100,
    }, 2 * step_delay)
    .add({
      targets: "#s1_leader",
      "border-color": "#fff",
      duration: 100,
    }, 2 * step_delay)
// 3.5
    .add({
      targets: ".epoch2_col",
      opacity: 1,
      duration: 100,
    }, 3 * step_delay)
// 4
    .add({
      targets: "#s4_leader",
      "border-color": "#000",
      duration: 100,
    }, 4 * step_delay)
// 5
    .add({
      targets: "#s4_x6",
      opacity: 1,
      duration: 100,
    }, 5 * step_delay)
// 6
    .add({
      targets: s_blur[4],
      vl: 5,
      duration: 100,
    }, 6 * step_delay)
    .add({
      targets: "#s4_leader",
      "border-color": "#fff",
      duration: 100,
    }, 6 * step_delay)
// 6.5
    .add({
      targets: ".epoch3_col",
      opacity: 1,
      duration: 100,
    }, 7 * step_delay)
// 7
    .add({
      targets: "#s3_leader",
      "border-color": "#000",
      duration: 100,
    }, 8 * step_delay)
// 8
    .add({
      targets: "#s3_x5",
      opacity: 1,
      duration: 100,
    }, 9 * step_delay)
// 9
    .add({
      targets: "#s2_x5",
      opacity: 1,
      duration: 100,
    }, 10 * step_delay)
    .add({
      targets: "#s2_x5",
      translateX: 50,
      duration: 100,
    }, 10 * step_delay)
    .add({
      targets: "#s2_x6",
      translateX: 50,
      duration: 100,
    }, 10 * step_delay)
// 10
    .add({
      targets: s_blur[2],
      vl: 5,
      duration: 100,
    }, 11 * step_delay)
// 11
    .add({
      targets: s_blur[3],
      vl: 5,
      duration: 100,
    }, 12 * step_delay)
    .add({
      targets: "#s3_leader",
      "border-color": "#fff",
      duration: 100,
    }, 12 * step_delay)
// 11.1
    .add({
      targets: s_blur[4],
      vl: 0,
      duration: 100,
    }, 13 * step_delay)
// 11.2
    .add({
      targets: s_blur[1],
      vl: 0,
      duration: 100,
    }, 14 * step_delay)
// 11.5
    .add({
      targets: ".epoch4_col",
      opacity: 1,
      duration: 100,
    }, 15 * step_delay)
// 12
    .add({
      targets: "#s4_leader",
      "border-color": "#000",
      duration: 100,
    }, 16 * step_delay)
// 13
    .add({
      targets: "#s4_x6",
      translateX: ex[4] - ex[2],
      duration: 100,
    }, 17 * step_delay)






animation.pause();
paused = true;
