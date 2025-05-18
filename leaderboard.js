const ScoreList = document.getElementById("leaderboard");





function update_leaderboard(json){
  for (const key in json) {

    if(key == "record"){
      json[key].forEach(entry => {
        console.log(`Entry: ${entry}`);

        let new_entry = document.createElement("li");
        new_entry.textContent = (`${entry.name}: ${entry.score}`);
        ScoreList.appendChild(new_entry);

      })
    }
    // console.log(entry);
  }
}

export async function get_json(){
  let req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      update_leaderboard(req.response);
    }
  };

  req.open("GET", "https://api.jsonbin.io/v3/b/682972918561e97a50164615/latest", true);
  req.responseType = 'json';
  req.setRequestHeader("X-Master-Key", "$2a$10$Q06DyexqnpkJyaggET34burVIEamxAxeutKiyttYq2587RkC6i34K");
  req.send();

}
