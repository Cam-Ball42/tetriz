const ScoreList = document.getElementById("leaderboard");
let scores;

export function refresh_leaderboard() {
  update_data();
}
function update_live_leaderboard() {
  console.log(scores);
  for (const key of scores.entries) {
    const element = document.createElement("li");
    element.innerText = `${key.name} : ${key.score}`;
    leaderboard.appendChild(element);
  }
}
function log_scores() {
  console.log(scores);
}

function update_data() {
  const req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState === XMLHttpRequest.DONE) {
      scores = req.response.record;
      update_live_leaderboard();
      log_scores();
      add_highscore("test", 69);
    }
  };
  req.open(
    "GET",
    "https://api.jsonbin.io/v3/b/682972918561e97a50164615/latest",
    true,
  );
  req.responseType = "json";
  req.setRequestHeader(
    "X-Master-Key",
    "$2a$10$Q06DyexqnpkJyaggET34burVIEamxAxeutKiyttYq2587RkC6i34K",
  );
  req.send();
}

export function add_highscore(name, score) {
  if (!scores.entries) {
    scores.entries = [];
  }
  const new_entry = { name, score };
  scores.entries.push(new_entry);
  send_hscore_req();
}

function send_hscore_req() {
  const req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState === XMLHttpRequest.DONE) {
      console.log("Highscore added!");
    }
  };

  req.open(
    "PUT",
    "https://api.jsonbin.io/v3/b/682972918561e97a50164615",
    "true",
  );
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader(
    "X-Master-Key",
    "$2a$10$Q06DyexqnpkJyaggET34burVIEamxAxeutKiyttYq2587RkC6i34K",
  );
  req.setRequestHeader(
    "X-Access-Key",
    "$2a$10$LdjcSJzwtcJN4bYDBbe/UOvWcYb3fCldi1Kvn086d/gq/5Nkm8x/m",
  );
  req.send(JSON.stringify(scores));
}
