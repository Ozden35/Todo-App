      let gorevListesi = [];
      //Sayfa ilk yüklendiğinde localStorage'da görev varsa alır.
      if (localStorage.getItem("görevListesi") !== null) {
        gorevListesi = JSON.parse(localStorage.getItem("görevListesi"));
      }

      let editId; // hangi görev düzenlenecekse onun ID’si.
      let isEditTask = false; //isEditTask: Yeni mi ekleniyor, yoksa güncelleniyor mu onu tutar.
      const taskInput = document.querySelector("#txtTaskName"); //taskInput: görev giriş kutusu.
      const btnClear = document.querySelector("#btnClear");
      const filters = document.querySelectorAll(".filters span"); //filters: “Tümü”, “Yapılacaklar”, “Tamamlananlar”.

      displayTasks("all");
      //Görevleri ekrana yazdırır. Filtreye göre completed, pending veya all olanlar gösterilir.Checkbox durumu, etiketin üstü çizili olup olmaması kontrol edilir.Her görev li şeklinde yazılır ve HTML’e eklenir.
      function displayTasks(filter) {
        const ul = document.getElementById("task-list");
        ul.innerHTML = "";

        if (gorevListesi.length == 0) {
          ul.innerHTML = "<p class='p-3 m-0'>Görev Listeniz boş</p>";
        } else {
          for (let gorev of gorevListesi) {
            let completed = gorev.durum == "completed" ? "checked" : "";

            if (filter == gorev.durum || filter == "all") {
              let li = `
                    <li class="task list-group-item d-flex justify-content-between align-items-center">
                        <div class="form-check">
                            <input type="checkbox" onclick="updateStatus(this)" id="${gorev.id}" class="form-check-input" ${completed}>
                            <label for="${gorev.id}" class="form-check-label ${completed}">${gorev.gorevAdi}</label>
                        </div>
                        <div class="dropdown">
                            <a class="btn btn-link btn-sm dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-ellipsis"></i>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash"></i> Sil</a></li>
                                <li><a onclick='editTask(${gorev.id},"${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle</a></li>
                            </ul>
                        </div>
                    </li>
                `;
              ul.insertAdjacentHTML("beforeend", li);
            }
          }
        }
      }

      document.querySelector("#btnAddNewTask").addEventListener("click", newTask);
      document.querySelector("#txtTaskName").addEventListener("keypress", function (event) {
          if (event.key == "Enter") {
            document.getElementById("btnAddNewTask").click();
            event.preventDefault();
          }
        });

      for (let span of filters) {
        span.addEventListener("click", function () {
          document.querySelector("span.active").classList.remove("active");
          span.classList.add("active");
          displayTasks(span.id);
        });
      }

      function newTask(event) {
        if (taskInput.value.trim() === "") {
          alert("Görev girmelisiniz");
        } else {
          if (!isEditTask) {
            //ekleme
            gorevListesi.push({
              id: gorevListesi.length + 1,
              gorevAdi: taskInput.value.trim(),
              durum: "pending",
            });
          } else {
            // güncelleme
            for (let gorev of gorevListesi) {
              if (gorev.id == editId) {
                gorev.gorevAdi = taskInput.value;
              }
              isEditTask = false;
            }
          }

          taskInput.value = "";
          displayTasks(document.querySelector("span.active").id);
          localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
          console.log(gorevListesi);
        }

        event.preventDefault();
      }
      function deleteTask(id) {
        deletedindex = gorevListesi.findIndex(function (gorev) {
          return gorev.id == id;
        });

        gorevListesi.splice(deletedindex, 1);
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
        displayTasks(document.querySelector("span.active").id);
      }

      function editTask(taskId, taskName) {
        editId = taskId;
        isEditTask = true;
        taskInput.value = taskName;
        taskInput.focus();
        taskInput.classList.add("active");
      }

      btnClear.addEventListener("click", function () {
        gorevListesi.splice(0, gorevListesi.length);
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
        displayTasks("all");
      });

      function updateStatus(selectedTask) {
        let label = selectedTask.nextElementSibling;
        let durum;
        if (selectedTask.checked) {
          label.classList.add("checked");
          durum = "completed";
        } else {
          label.classList.remove("checked");
          durum = "pending";
        }

        for (let gorev of gorevListesi) {
          if (gorev.id == selectedTask.id) {
            gorev.durum = durum;
          }
        }
        displayTasks(document.querySelector("span.active").id);
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
      }


