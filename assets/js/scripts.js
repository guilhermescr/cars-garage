(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTime(ms) {
        const min = Math.floor(ms / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        return `${min}min and ${sec}s`;
    }
    function parkSpace() {
        function read() {
            return localStorage.parkSpace ? JSON.parse(localStorage.parkSpace) : [];
        }
        function save(cars) {
            localStorage.setItem("parkSpace", JSON.stringify(cars));
        }
        function addCarSpot(car, saving) {
            var _a, _b;
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
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                deleteCarSpot(this.dataset.plate);
            });
            (_b = $("#parking-area")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (saving) {
                save([...read(), car]);
            }
            ;
        }
        function deleteCarSpot(plate) {
            const { entrance, owner } = read().find(car => car.plate === plate);
            const time = calcTime(new Date().getTime() - new Date(entrance).getTime());
            if (!confirm(`The car ${owner} was here for ${time}. Do you want to leave?`))
                return;
            save(read().filter((car) => car.plate !== plate));
            render();
        }
        function render() {
            $("#parking-area").innerHTML = "";
            const parkArea = read();
            if (parkArea.length) {
                parkArea.forEach((car) => addCarSpot(car));
            }
        }
        return { read, addCarSpot, deleteCarSpot, save, render };
    }
    parkSpace().render();
    (_a = $("#registerBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b, _c;
        const owner = (_a = $("#owner")) === null || _a === void 0 ? void 0 : _a.value;
        const brand = (_b = $("#brand")) === null || _b === void 0 ? void 0 : _b.value;
        const plate = (_c = $("#license-plate")) === null || _c === void 0 ? void 0 : _c.value;
        if (!owner || !brand || !plate) {
            alert("You have to fill all the inputs!");
            return;
        }
        parkSpace().addCarSpot({ owner, brand, plate, entrance: new Date().toISOString() }, true);
    });
})();
console.log("Testando!");
