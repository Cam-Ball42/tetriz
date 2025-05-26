const ScoreList = document.getElementById("leaderboard");
let scores;

function sort_scores() {
  scores.entries = scores.entries.sort((a, b) => b.score - a.score);
}

export function determine_high_score(score) {
  sort_scores();

  let highest_spot = 11;
  for (let i = scores.entries.length - 1; i >= 0; i--) {
    if (score > scores.entries[i].score) {
      highest_spot = i;
    }
  }
  if (highest_spot < 10) {
    return true;
  }
}

export function get_scores() {
  sort_scores();
  return scores.entries;
}

export function refresh_leaderboard() {
  update_data();
}
function update_live_leaderboard() {
  sort_scores();
  ScoreList.innerHTML = "";
  for (const key of scores.entries) {
    const element = document.createElement("li");
    element.innerText = `${key.name} : ${key.score}`;
    ScoreList.appendChild(element);
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
  const new_entry = { name, score };
  scores.entries.push(new_entry);
  sort_scores();

  if (scores.entries.length > 10) {
    scores.entries = scores.entries.slice(0, 10);
  }
  send_hscore_change();
}

function send_hscore_change() {
  const req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState === XMLHttpRequest.DONE) {
      console.log("Highscore added!");
      refresh_leaderboard();
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
