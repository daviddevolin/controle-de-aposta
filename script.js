document.addEventListener("DOMContentLoaded", function () {
    const calendarBody = document.getElementById("calendar-body");
    const monthYear = document.getElementById("month-year");
    const prevMonthButton = document.getElementById("prev-month");
    const nextMonthButton = document.getElementById("next-month");
    const dayDetails = document.getElementById("day-details");
    const selectedDayElement = document.getElementById("selected-day");
    const detailsTableBody = document.querySelector("#details-table tbody");
    const totalInvestment = document.getElementById("total-investment");
    const totalPossibleReturn = document.getElementById("total-possible-return");
    const totalProfit = document.getElementById("total-profit");
    const saveDataButton = document.getElementById("save-data");
    const exportCsvButton = document.getElementById("export-csv");
    const addRowButton = document.getElementById("add-row");
  
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    let selectedDay = null;
    let data = {};
    let historico = [];
  
    // Função para gerar o calendário
    function generateCalendar(year, month) {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDay = firstDay.getDay();
  
      monthYear.textContent = `${firstDay.toLocaleString("pt-BR", { month: "long" })} ${year}`;
  
      let date = 1;
      let html = "";
  
      for (let i = 0; i < 6; i++) {
        html += "<tr>";
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < startingDay) {
            html += "<td></td>";
          } else if (date > daysInMonth) {
            html += "<td></td>";
          } else {
            html += `<td>${date}</td>`;
            date++;
          }
        }
        html += "</tr>";
      }
  
      calendarBody.innerHTML = html;
    }
  
    // Função para mudar o mês
    function changeMonth(offset) {
      currentMonth += offset;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      generateCalendar(currentYear, currentMonth);
    }
  
    // Função para carregar dados salvos
    function loadData() {
      const savedData = localStorage.getItem("calendarData");
      if (savedData) {
        data = JSON.parse(savedData);
      }
  
      const savedHistorico = localStorage.getItem("historico");
      if (savedHistorico) {
        historico = JSON.parse(savedHistorico);
      }
    }
  
    // Função para salvar dados
    function saveData() {
      localStorage.setItem("calendarData", JSON.stringify(data));
      localStorage.setItem("historico", JSON.stringify(historico));
      alert("Dados salvos com sucesso!");
    }
  
    // Função para exportar dados para CSV
    function exportToCsv() {
      const csvContent = "data:text/csv;charset=utf-8," +
        "Casa,Valor,Odd,Possível Retorno,Resultado,Lucro\n" +
        data[selectedDay].map(row => Object.values(row).join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `dados_${selectedDay}.csv`);
      document.body.appendChild(link);
      link.click();
    }
  
    // Função para adicionar uma nova linha
    function addRow() {
      if (!data[selectedDay]) data[selectedDay] = [];
      data[selectedDay].push({ casa: "", valor: 0, odd: 0, resultado: "Open", lucro: 0 });
      updateDetailsTable();
    }
  
    // Função para atualizar a tabela de detalhes
    function updateDetailsTable() {
      detailsTableBody.innerHTML = data[selectedDay]
        .map((row, index) => `
          <tr>
            <td><input type="text" value="${row.casa}" onchange="updateRow(${index}, 'casa', this.value)"></td>
            <td><input type="number" value="${row.valor}" onchange="updateRow(${index}, 'valor', this.value)"></td>
            <td><input type="number" value="${row.odd}" onchange="updateRow(${index}, 'odd', this.value)"></td>
            <td>${row.valor * row.odd}</td>
            <td>
              <select onchange="updateRow(${index}, 'resultado', this.value)">
                <option value="Green" ${row.resultado === "Green" ? "selected" : ""}>Green</option>
                <option value="Red" ${row.resultado === "Red" ? "selected" : ""}>Red</option>
                <option value="Open" ${row.resultado === "Open" ? "selected" : ""}>Open</option>
              </select>
            </td>
            <td>${row.lucro}</td>
            <td><button onclick="deleteRow(${index})">Excluir</button></td>
          </tr>
        `)
        .join("");
  
      // Atualizar a tabela de resumo
      const totalInv = data[selectedDay].reduce((sum, row) => sum + parseFloat(row.valor), 0);
      const totalRet = data[selectedDay].reduce((sum, row) => sum + (row.valor * row.odd), 0);
      const totalProf = data[selectedDay].reduce((sum, row) => sum + parseFloat(row.lucro), 0);
  
      totalInvestment.textContent = totalInv.toFixed(2);
      totalPossibleReturn.textContent = totalRet.toFixed(2);
      totalProfit.textContent = totalProf.toFixed(2);
  
      // Adicionar ao histórico
      historico.push({
        data: selectedDay,
        investimentoTotal: totalInv,
        possivelRetornoTotal: totalRet,
        lucroTotal: totalProf,
      });
    }
  
    // Função para atualizar uma linha
    window.updateRow = function (index, field, value) {
      data[selectedDay][index][field] = value;
  
      // Calcular o Lucro com base no Resultado
      const row = data[selectedDay][index];
      if (field === "resultado" || field === "valor" || field === "odd") {
        if (row.resultado === "Green") {
          row.lucro = (row.valor * row.odd) - row.valor;
        } else if (row.resultado === "Red") {
          row.lucro = 0 - row.valor;
        } else {
          row.lucro = 0;
        }
      }
  
      updateDetailsTable();
    };
  
    // Função para excluir uma linha
    window.deleteRow = function (index) {
      data[selectedDay].splice(index, 1);
      updateDetailsTable();
    };
  
    // Eventos para os botões de navegação
    prevMonthButton.addEventListener("click", () => changeMonth(-1));
    nextMonthButton.addEventListener("click", () => changeMonth(1));
  
    // Evento para salvar dados
    saveDataButton.addEventListener("click", saveData);
  
    // Evento para exportar CSV
    exportCsvButton.addEventListener("click", exportToCsv);
  
    // Evento para adicionar linha
    addRowButton.addEventListener("click", addRow);
  
    // Gerar calendário inicial
    generateCalendar(currentYear, currentMonth);
  
    // Carregar dados salvos
    loadData();
  
    // Adicionar interatividade (exibir detalhes ao clicar em um dia)
    calendarBody.addEventListener("click", function (event) {
      if (event.target.tagName === "TD" && event.target.textContent) {
        selectedDay = event.target.textContent;
        selectedDayElement.textContent = selectedDay;
        dayDetails.classList.remove("hidden");
  
        if (!data[selectedDay]) data[selectedDay] = [];
        updateDetailsTable();
      }
    });
  });
  
  // Código do Histórico (executado apenas na página de histórico)
  if (window.location.pathname.includes("historico.html")) {
    document.addEventListener("DOMContentLoaded", function () {
      const historicoTableBody = document.querySelector("#historico-table tbody");
      const dataInicioInput = document.getElementById("data-inicio");
      const dataFimInput = document.getElementById("data-fim");
      const filtrarButton = document.getElementById("filtrar");
      const graficoLucro = document.getElementById("grafico-lucro");
  
      let historico = [];
      let grafico;
  
      // Função para carregar o histórico
      function loadHistorico() {
        const savedHistorico = localStorage.getItem("historico");
        if (savedHistorico) {
          historico = JSON.parse(savedHistorico);
          updateHistoricoTable(historico);
          updateGrafico(historico);
        }
      }
  
      // Função para atualizar a tabela de histórico
      function updateHistoricoTable(historico) {
        if (historicoTableBody) {
          historicoTableBody.innerHTML = historico
            .map((item) => `
              <tr>
                <td>${item.data}</td>
                <td>${item.investimentoTotal.toFixed(2)}</td>
                <td>${item.possivelRetornoTotal.toFixed(2)}</td>
                <td>${item.lucroTotal.toFixed(2)}</td>
              </tr>
            `)
            .join("");
        }
      }
  
      // Função para atualizar o gráfico
      function updateGrafico(dados) {
        const labels = dados.map(item => item.data);
        const lucros = dados.map(item => item.lucroTotal);
  
        if (grafico) {
          grafico.destroy(); // Destrói o gráfico existente
        }
  
        grafico = new Chart(graficoLucro, {
          type: "line",
          data: {
            labels: labels,
            datasets: [{
              label: "Lucro Total",
              data: lucros,
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0.1)",
              fill: true,
            }],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
  
      // Função para filtrar os dados por data
      function filtrarPorData() {
        const dataInicio = new Date(dataInicioInput.value);
        const dataFim = new Date(dataFimInput.value);
  
        const dadosFiltrados = historico.filter(item => {
          const dataItem = new Date(item.data);
          return dataItem >= dataInicio && dataItem <= dataFim;
        });
  
        updateHistoricoTable(dadosFiltrados);
        updateGrafico(dadosFiltrados);
      }
  
      // Evento para filtrar os dados
      filtrarButton.addEventListener("click", filtrarPorData);
  
      // Carregar o histórico ao abrir a página
      loadHistorico();
    });
  }