let keys = ['A','B','C','X','Y','Z'];
let vals = [0, 1, 2, 3, 4, 5, 6, 7];
let log = [];
let states = [{}];
let state = {};
let log_frames = [];
let sm_frames = [];
let sm_obj = {lsn: 0};

for (i=0; i<40; ++i) {
  let k = keys[Math.floor(keys.length * Math.random())];
  let v = vals[Math.floor(vals.length * Math.random())];
  state[k] = [v, i];
  $('#log').append("<div class='message'>" + k.toString() + ": " + v.toString() + "</div>");
  log.push({key: k, val: v});
  states.push({...state});
  log_frames.push({
    translateX: -92 * (i + 1),
    delay: 1000,
    duration: 500,
  });
}


let animation = 
  anime({
    targets: '#log',
    keyframes: log_frames,
    update: function() {
      let lsn = Math.max(0, Math.floor(8-document.getElementById('log').getBoundingClientRect().x / 92));
      console.log('update called: ' + lsn);
        let src = 
            "<table class='kvstore'><thead><td>Key</td><td>Value</td><td>LastModified</td></thead>";
      for (const k in states[lsn]) {
        src += "<tr><td>" + k.toString() + "</td><td>"
          + states[lsn][k][0] + "</td><td>"
          + states[lsn][k][1] + "</td></tr>";
      }
      src += "</table>";
      document.getElementById("statemachine").innerHTML = src;
      if (!scrubbing) {
        progress_slider.value = animation.progress;
      }
    },
  });
