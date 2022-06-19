interface Car {
  owner: string;
  brand: string;
  plate: string;
  entrance: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

  function calcTime(ms: number) {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);

    return `${min}min and ${sec}s`;
  }

  function parkSpace() {
    function read(): Car[] {
      return localStorage.parkSpace ? JSON.parse(localStorage.parkSpace) : [];
    }

    function save(cars: Car[]) {
      localStorage.setItem("parkSpace", JSON.stringify(cars));
    }

    function addCarSpot(car: Car, saving?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td>${car.owner}</td>
      <td>${car.brand}</td>
      <td>${car.plate}</td>
      <td>${car.entrance}</td>
      <td>
        <button class="delete" data-plate="${car.plate}">X</button>
      </td>
      `;

      row.querySelector(".delete")?.addEventListener("click", function() {
        deleteCarSpot(this.dataset.plate);
      });

      $("#parking-area")?.appendChild(row);

      if (saving) {save([...read(), car])};
    }

    function deleteCarSpot(plate: string) {
      const { entrance, owner } = read().find(car => car.plate === plate);

      const time = calcTime(new Date().getTime() - new Date(entrance).getTime());

      if (!confirm(`The car ${owner} was here for ${time}. Do you want to leave?`)) return;

      save(read().filter((car) => car.plate !== plate));
      render();
    }

    function render() {
      $("#parking-area")!.innerHTML = "";
      const parkArea = read();

      if (parkArea.length) {
        parkArea.forEach((car) => addCarSpot(car));
      }
    }

    return { read, addCarSpot, deleteCarSpot, save, render };
  }

  parkSpace().render();
  $("#registerBtn")?.addEventListener("click", () => {
    const owner = $("#owner")?.value;
    const brand = $("#brand")?.value;
    const plate = $("#license-plate")?.value;

    if (!owner || !brand || !plate) {
      alert("You have to fill all the inputs!");
      return;
    }
    parkSpace().addCarSpot({ owner, brand, plate, entrance: new Date().toISOString() }, true);
  });
})();

console.log("Testando!");