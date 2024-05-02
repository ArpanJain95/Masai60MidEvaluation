async function emplManagementSystem(data) {
  const root = document.getElementById("root");
  root.innerHTML = `
  <nav>
      <div>
          <h1>Employee Management System</h1>
      </div>
      <form>
          <label for="selectDep">Filter by Department:
              <select name="department" id="selectDep">
                  <option value="" disabled selected>--Select Department--</option>
                  <option value="hr">HR</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="engineering">Engineering</option>
                  <option value="operations">Operations</option>
              </select>
          </label>
          <label for="selectGen">Filter by Gender:
              <select name="gender" id="selectGen">
                  <option value="" disabled selected>--Select gender--</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
              </select>
          </label>
          <label for="sortSalary">Sort by Salary:
              <select name="salary" id="sortSalary">
                  <option value="" disabled selected>--Select Order--</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
              </select>
          </label>
      </form>
    </nav>
    <main>
      <table>
        <thead>
            <tr>
                <th>S.no</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Department</th>
                <th>Salary</th>
            </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
      <div>
        <button id="prevBtn">&lt; Previous</button>
        <button id="nextBtn">Next &gt;</button>
      </div>
    </main>
  `;

  const selectDep = document.getElementById("selectDep");
  selectDep.addEventListener("input", handleFilter);
  const selectGen = document.getElementById("selectGen");
  selectGen.addEventListener("change", handleFilter);
  const sortSalary = document.getElementById("sortSalary");
  sortSalary.addEventListener("change", handleFilter);
  const prevBtn = document.getElementById("prevBtn");
  prevBtn.addEventListener("click", handlePrevNext);
  const nextBtn = document.getElementById("nextBtn");
  nextBtn.addEventListener("click", handlePrevNext);

  await handleFilter();
};

let currentPage = 1

let department = "";
let gender = "";
let salaryRange = "";

async function handleFilter() {
  department = selectDep.value;
  gender = selectGen.value;
  salaryRange = sortSalary.value;
  console.log(department, gender, salaryRange);

  const tableData = await fetchData(currentPage, department, gender, salaryRange);
  tableBody(tableData);

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = tableData.length < 10;
}

async function handlePrevNext() {
  if (this.id === "prevBtn" && currentPage > 1) {
    currentPage--;
  } else if(this.id === "nextBtn") {
    currentPage++;
  }

  await handleFilter();
}

function tableBody(tableData) {
  const tBody = document.getElementById("tableBody");
  tBody.innerHTML = "";

  tableData.forEach((post, index) => {
    const row = `
    <tr>
      <td>${index + 1}</td>
      <td>${post.name}</td>
      <td>${post.gender}</td>
      <td>${post.department}</td>
      <td>${post.salary}</td>
    </tr>
    `
    tBody.innerHTML += row;
  });
}

async function fetchData(page) {
  try {
    let url = `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees?page=${page}&limit=10`

    url += department ? `&filterBy=department&filterValue=${department}` : "";
    url += gender ? `&filterBy=gender&filterValue=${gender}` : "";
    url += salaryRange ? `&sort=salary&order=${salaryRange}` : "";

    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
}

emplManagementSystem();
