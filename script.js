//fetch()

// $(".search-button").on("click", function () {
//   $.ajax({
//     url:
//       "http://www.omdbapi.com/?apikey=f99cc87c&s=" + $(".input-keyword").val(),
//     success: (result) => {
//       const movies = result.Search; //untuk ambil object saja , jadi movie di gabung dengan hanya hasil Search saja
//       let card = "";
//       movies.forEach((m) => {
//         //kita looping satu2
//         card += showMovie(m);
//       });
//       $(".movies").html(card); // jquery carikan class movie di gabung dengan html card

//       //ketika tombol deatail di klik
//       $(".modal-detail-button").on("click", function () {
//         //jquery ambil button yang class modal-detail-button , trus pada saat di onclick
//         $.ajax({
//           //jalankan ajax
//           url:
//             "http://www.omdbapi.com/?apikey=f99cc87c&i=" + $(this).data("imdb"), //jquery ambil tombol ini/yang di klik , ambil data imdb ,
//           success: (i) => {
//             //jika susses
//             const movieDetail = showMovieDetail(i);
//             $(".modal-body").html(movieDetail); // jquery ambil modal-body di gabung dengan movieDetail
//           },

//           error: (e) => {
//             console.log(e.responseText);
//           },
//         });
//       });
//     },

//     error: (e) => {
//       console.log(e.responseText);
//     },
//   });
// });

// mengunakan fetch

// const search = document.querySelector(".search-button");
// search.addEventListener("click", function () {
//   const inputKeyword = document.querySelector(".input-keyword");
//   fetch("http://www.omdbapi.com/?apikey=f99cc87c&s=" + inputKeyword.value)
//     .then((response) => response.json())
//     .then((response) => {
//       const movie = response.Search;
//       let cards = "";
//       movie.forEach((m) => (cards += showMovie(m)));
//       const movieContainer = document.querySelector(".movie-container");
//       movieContainer.innerHTML = cards;
//       // ketika tombol di klik

//       const buttonDetail = document.querySelectorAll(".modal-detail-button");
//       buttonDetail.forEach((btn) => {
//         btn.addEventListener("click", function () {
//           const imdbid = this.dataset.imdb;
//           fetch("http://www.omdbapi.com/?apikey=f99cc87c&i=" + imdbid)
//             .then((response) => response.json())
//             .then((i) => {
//               const movieDetail = showMovieDetail(i);
//               const modalBody = document.querySelector(".modal-body");
//               modalBody.innerHTML = movieDetail;
//             });
//         });
//       });
//     });
// });

const search = document.querySelector(".search-button");
search.addEventListener("click", async function () {
  try {
    const inputKeyword = document.querySelector(".input-keyword");
    const movies = await getMovie(inputKeyword.value);
    updateUI(movies);
  } catch (err) {
    const alert = document.querySelector(".alert");
    alert.innerHTML = tampilError(err);
  }
});

function getMovie(keyword) {
  return fetch(
    "https://cors-anywhere.herokuapp.com/www.omdbapi.com/?apikey=f99cc87c&s=" +
      keyword
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

function updateUI(movies) {
  let cards = "";
  movies.forEach((m) => (cards += showMovie(m)));
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = cards;
}

// even binding
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-detail-button")) {
    const imdbid = e.target.dataset.imdb;
    // console.log(imdbid);
    const movieDetail = await getMovieDetail(imdbid);
    updateDetailUi(movieDetail);
  }
});

function getMovieDetail(imdbid) {
  return fetch(
    "https://cors-anywhere.herokuapp.com/www.omdbapi.com/?apikey=f99cc87c&i=" +
      imdbid
  )
    .then((response) => response.json())
    .then((i) => i);
}

function updateDetailUi(i) {
  const movieDetail = showMovieDetail(i);
  // console.log(movieDetail);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = movieDetail;
}

function tampilError(m) {
  return `  <div class="alert alert-warning" role="alert">${m}</div>`;
}

function showMovie(m) {
  return `<div class="col-md-4 my-4">
  <div class="card">
    <img src="${m.Poster}" class="card-img-top" />
    <div class="card-body">
      <h5 class="card-title">${m.Title}</h5>
      <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
      <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#detailMovieModal" data-imdb=${m.imdbID}>Show Detail</a>
    </div>
  </div>
</div>`;
}

function showMovieDetail(i) {
  return `<div class="container-fluid">
  <div class="row">
    <div class="col-md-3">
      <img src="${i.Poster}" class="img-fluid" />
    </div>
    <div class="col-md">
      <ul class="list-group">
        <li class="list-group-item"><h4>${i.Title} (${i.Year}) </h4></li>
        <li class="list-group-item">
          <strong>Director :</strong> ${i.Director}
        </li>
        <li class="list-group-item">
          <strong>Actors :</strong>${i.Actors}
        </li>
        <li class="list-group-item">
          <strong>Writer :</strong>${i.Writer}
        </li>
        <li class="list-group-item">
          <strong>Plot :</strong>${i.Plot}
      </ul>
    </div>
  </div>
</div>`;
}
