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

function drawCluster() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Move server icons, draw lines
  //
  ctx.strokeStyle = 'rgb(230,230,230)';
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.ellipse(clusterPos.x, clusterPos.y, r, r, 0, 0, 2 * Math.PI);
  ctx.stroke();        

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

  for (i=0; i<5; ++i) {  
    let sRect = document.querySelector(sq[i]).getBoundingClientRect();
    $(sq[i]).css({
      left: sx[i] - sRect.width / 2,
      top:  sy[i] - sRect.height / 2,
    });
    
    ctx.strokeStyle = 'black';
    if (s_avail[i]) {
      ctx.fillStyle = 'rgb(200, 255, 230)';
    } else {
      ctx.fillStyle = 'rgb(255, 200, 200)';
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

function startRequest() {
  $('#go').css({visibility: "hidden"});
  $('#play_pause').css({visibility: "visible"});

  let reqSdx = 35;
  let ansSdx = -90;
  let ans_elem = [{}];
  let client = document.querySelector(".client");
  let client_rect = client.getBoundingClientRect();
  let leaderReqY = client_rect.y + client_rect.height / 2 - 32;
  
  for (var i=1; i<=5; ++i) {
    let req_i = document.getElementById("r" + i.toString());
    $(req_i).css({
      position: "absolute",
      display: "block",
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
        left: sx[0] + Math.cos(getAngle(0)) * 136 - 24,
        top:  sy[0] + Math.sin(getAngle(0)) * 136 - 24,
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
      duration: 1250,
    })
    .add({
      targets: "#ok1",
      opacity: 1,
      duration: 150,
    }, 1250);

  let l2f_duration = [0, 0];
  let f2l_duration = [0, 0];
  for (i=2; i<=5; ++i) {
    let l2f_d = 1000 + Math.random() * 1500;
    let f2l_d = 1000 + Math.random() * 1500;
    
    l2f_duration.push(l2f_d);
    f2l_duration.push(f2l_d);
    
    if (s_avail[i-1]) {
      animation.add({
        targets: "#r" + i.toString(),
        translateX: sx[i-1] + reqSdx - (client_rect.x + client_rect.width),
        translateY: sy[i-1] - leaderReqY - 32,
        duration: l2f_duration[i],
      }, 1250)
    } else {
      animation.add({
        targets: "#r" + i.toString(),
        translateX: sx[i-1] + reqSdx - (client_rect.x + client_rect.width),
        translateY: sy[i-1] - leaderReqY - 32,
        opacity: 0,
        duration: l2f_duration[i],
      }, 1250);
    }
    animation.add({
      targets: ans_elem[i],
      opacity: 1,
      duration: 150,
    }, 1250 + l2f_duration[i]);

    animation.add({
      targets: ans_elem[i],
      translateX: sx[0] + Math.cos(getAngle(i-1)) * 136 - 24 - (sx[i-1] + ansSdx),
      translateY: sy[0] + Math.sin(getAngle(i-1)) * 136 - 24 - (sy[i-1] - 24),
      duration: f2l_duration[i],
    }, 1250 + l2f_duration[i]);
  }

}

document.getElementById("go").onclick = function () {
  startRequest();
};
