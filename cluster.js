let canvas = document.getElementById('backdrop');
let rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;

let ctx = canvas.getContext('2d');

/*
ctx.globalAlpha = 1.0;    
let grd = ctx.createRadialGradient(
  canvas.width / 2, canvas.height / 2, 100, 
  canvas.width / 2, canvas.height / 2, 1000
);
grd.addColorStop(0, '#e0eee0');
grd.addColorStop(1, '#b0bbbb');

ctx.fillStyle = grd;
ctx.fillRect(0, 0, canvas.width, canvas.height);
*/

let clusterPos = document.getElementById('clusterCenter').getBoundingClientRect();
let r = clusterPos.width;

function getAngle(i) {
  let angle = Math.PI * 2 / 2 + Math.PI * 2 * i / 5;
  return angle;
}

// Calculate server positions.
//
let sq = [];
let sx = [];
let sy = [];
for (i=0; i<5; ++i) {
  sq.push("#s" + (i+1).toString());
  let angle = getAngle(i);
  let x = clusterPos.x + r * Math.cos(angle);
  let y = clusterPos.y + r * Math.sin(angle);
  sx.push(x);
  sy.push(y);
}

let s_avail = [true, true, true, true, true];

let quorum0 = [];
let quorum1 = [];

function qCommon() {
  let common = [];
  if (quorum0.length >= 3 && quorum1.length >= 3) {
    for (var i=0; i<quorum0.length; ++i) {
      if (quorum1.includes(quorum0[i])) {
        common.push(quorum0[i]);
      }
    }
  }
  return common;
}

function drawQuorum(q, color, dx, dy) {
  if (q.length >= 2) {
    ctx.lineWidth = 16;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(sx[q[q.length-1]] + dx, sy[q[q.length-1]] + dy);
    for (var i=0; i<q.length; ++i) {
      ctx.lineTo(sx[q[i]] + dx, sy[q[i]] + dy);
    }
    ctx.stroke();
  }  
}

function drawCluster() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw background cluster circle.
  //
  ctx.strokeStyle = 'rgb(230,230,230)';
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.ellipse(clusterPos.x, clusterPos.y, r, r, 0, 0, 2 * Math.PI);
  ctx.stroke();        

  // Draw lines to Leader.
  //
  if (quorum0.length < 3 && quorum1.length < 3) {
    for (i=1; i<5; ++i) {
      if (!s_avail[i]) {
        continue;
      }
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(sx[0], sy[0]);
      ctx.lineTo(sx[i], sy[i]);
      ctx.stroke();
    }
  }

  // If showing quorums, draw here.
  //
  drawQuorum(quorum0, 'blue', -8, -8);
  drawQuorum(quorum1, 'purple', 8, 8);

  for (i=0; i<5; ++i) {
    // Position the server icon.
    //
    let sRect = document.querySelector(sq[i]).getBoundingClientRect();
    $(sq[i]).css({
      left: sx[i] - sRect.width / 2,
      top:  sy[i] - sRect.height / 2,
    });

    // Draw the circle around each server.
    //
    ctx.strokeStyle = 'black';
    if (qCommon().includes(i)) {
        ctx.fillStyle = 'rgb(150, 150, 230)';
    } else {
      if (s_avail[i]) {
        $(sq[i]).css({filter: "blur(0)"});
        ctx.fillStyle = 'rgb(200, 255, 230)';
      } else {
        $(sq[i]).css({filter: "blur(2px)"});
        ctx.fillStyle = 'rgb(255, 200, 200)';
      }
    }
    if (i == 0) {
      ctx.lineWidth = 16;
    } else {
      ctx.lineWidth = 2;
    }
    ctx.beginPath();
    ctx.ellipse(sx[i], sy[i], sRect.width * 3/4, sRect.height * 3/4, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
}

function setServerEvents(i) {
  let s_i = document.getElementById("s" + (i+1).toString());
  s_i.onclick = function () {
    s_avail[i] = !s_avail[i];
    drawCluster();
  };
}

for (i=1; i<5; ++i) {
  setServerEvents(i);
}
drawCluster();


let animation = null;

function cluster_up() {
  let upcount = 0;
  for (var i=0; i<5; ++i) {
    if (s_avail[i]) {
      ++upcount;
    }
  }
  return upcount >= 3 && s_avail[0];
}

function startRequest() {
  $('#go').css({visibility: "hidden"});
  $('#play_pause').css({visibility: "visible"});

  let reqSdx = 40;
  let ansSdx = -90;
  let ans_elem = [{}];
  let client_ans = null;
  let client = document.querySelector(".client");
  let client_rect = client.getBoundingClientRect();
  let leaderReqY = client_rect.y + client_rect.height / 2 - 32;

  let c2l_duration = 1500;
  
  if (cluster_up()) {
    client_ans = document.querySelector("#okClient");
  } else {
    client_ans = document.querySelector("#errClient");
  }
  $(client_ans).css({
    position: "absolute",
    display: "block",
    opacity: 0,
    left: sx[0] + Math.cos(getAngle(0)) * 136 - 24,
    top:  sy[0] + Math.sin(getAngle(0)) * 136 - 24,
  });
  
  for (var i=1; i<=5; ++i) {
    let req_i = document.getElementById("r" + i.toString());
    $(req_i).css({
      position: "absolute",
      opacity: 1,
      left: client_rect.x + client_rect.width,
      top: leaderReqY,
    });

    if (s_avail[i-1]) {
      ans_elem.push(document.getElementById("ok" + i.toString()));
    } else {
      ans_elem.push(document.getElementById("err" + i.toString()));
    }
    console.log("ans " + i.toString() + " : " + ans_elem[i].id);
    let op = 0;
    if (i == 1) {
      $(ans_elem[i]).css({
        position: "absolute",
        display: "block",
        opacity: 0,
        left: sx[0] + ansSdx,
        top: sy[0] - 32,
      });
    } else {
      $(ans_elem[i]).css({
        position: "absolute",
        display: "block",
        opacity: 0,
        left: sx[i-1] + ansSdx,
        top: sy[i-1] - 24,
      });
    }
  }

  let leaderReqX = sx[0] + reqSdx;
  animation = anime.timeline({
    easing: "linear",
    update: function () {
        progress_slider.value = animation.progress;
    }
  })
    .add({
      targets: ".request",
      translateX: leaderReqX - (client_rect.x + client_rect.width),
      duration: c2l_duration,
    })
    .add({
      targets: "#ok1",
      opacity: 1,
      duration: 150,
    }, c2l_duration);

  // Generate a set of random message transmission delays.
  //
  let l2f_duration = [0, 0];
  let f2l_duration = [0, 0];

  for (i=2; i<=5; ++i) {
    let l2f_d = 1000 + Math.random() * 2500;
    let f2l_d = 1000 + Math.random() * 2500;
    
    l2f_duration.push(l2f_d);
    f2l_duration.push(f2l_d);
  }
  
  // Figure out the time when the leader knows the result.
  //
  let quorum_delays = [];
  for (i=1; i<5; ++i) {
    if (s_avail[i] == cluster_up()) {
      quorum_delays.push(l2f_duration[i+1] + f2l_duration[i+1]);
    }
  }
  quorum_delays.sort();
  let response_delay = (function() {
    if (!s_avail[0]) {
      return 0;
    } else if (cluster_up()) {
      return quorum_delays[1];
    } else {
      return quorum_delays[2];
    }
  })() + c2l_duration;

  // Set up the animation.
  //
  for (i=2; i<=5; ++i) {
    if (s_avail[i-1]) {
      animation.add({
        targets: "#r" + i.toString(),
        translateX: sx[i-1] + reqSdx - (client_rect.x + client_rect.width),
        translateY: sy[i-1] - leaderReqY - 32,
        duration: l2f_duration[i],
      }, c2l_duration)
    } else {
      animation.add({
        targets: "#r" + i.toString(),
        translateX: sx[i-1] + reqSdx - (client_rect.x + client_rect.width),
        translateY: sy[i-1] - leaderReqY - 32,
        opacity: 0,
        duration: l2f_duration[i],
      }, c2l_duration);
    }
    animation.add({
      targets: ans_elem[i],
      opacity: 1,
      duration: 150,
    }, c2l_duration + l2f_duration[i]);

    animation.add({
      targets: ans_elem[i],
      translateX: sx[0] + Math.cos(getAngle(i-1)) * 136 - 24 - (sx[i-1] + ansSdx),
      translateY: sy[0] + Math.sin(getAngle(i-1)) * 136 - 24 - (sy[i-1] - 24),
      duration: f2l_duration[i],
    }, c2l_duration + l2f_duration[i]);
  }

  animation
    .add({
      targets: client_ans,
      opacity: 1,
      duration: 150,
    }, response_delay)
    .add({
      targets: client_ans,
      translateX: (client_rect.x + client_rect.width + 20) - (sx[0] - 136),
      duration: c2l_duration,
    }, response_delay);

  if (cluster_up()) {
    for (i=1; i<=5; ++i) {
      let this_delay = response_delay;
      if (i > 1) {
        this_delay = Math.max(response_delay, c2l_duration + l2f_duration[i] + f2l_duration[i]);
      }
      if (s_avail[i-1]) {
        animation.add({
          targets: ans_elem[i],
          easing: "linear",
          translateX: 0,
          translateY: 0,
          duration: 1000 + Math.random(2500),
          update: (function() {
            let j = i;
            let step_start = this_delay;
            return function() {
              if (animation.progress * animation.duration / 100 > step_start) {
                ans_elem[j].src = "icons/check-all.svg";
              } else {
                ans_elem[j].src = "icons/check.svg";
              }              
            };
          })(),
        }, this_delay);
      }
    }
  }
}

document.getElementById("go").onclick = function () {
  startRequest();
  animation.pause();
  paused = true;
  document.querySelector("#progress").value = 0;
};

document.getElementById("show_quorums").onclick = function () {
  let qs = [
    [0, 1, 2],
    [0, 1, 3],
    [0, 1, 4],
    [0, 2, 3],
    [0, 2, 4],
    [0, 3, 4],
    [1, 2, 3],
    [1, 2, 4],
    [1, 3, 4],
    [2, 3, 4],
    [1, 2, 3, 4],
    [0, 2, 3, 4],
    [0, 1, 3, 4],
    [0, 1, 2, 4],
    [0, 1, 2, 3],
    [0, 1, 2, 3, 4],
  ];
  //  quorum0 = qs[Math.floor(Math.random() * qs.length)];
  quorum0 = [];
  for (var i=0; i<5; ++i) {
    if (s_avail[i]) {
      quorum0.push(i);
    }
  }
  quorum1 = qs[Math.floor(Math.random() * qs.length)];
  drawCluster();
};


document.getElementById("show_quorums").ondblclick = function() {
  quorum0 = [];
  quorum1 = [];
  drawCluster();
};
