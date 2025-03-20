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
  
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
  
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
  
    // Eventos para os botões de navegação
    prevMonthButton.addEventListener("click", () => changeMonth(-1));
    nextMonthButton.addEventListener("click", () => changeMonth(1));
  
    // Gerar calendário inicial
    generateCalendar(currentYear, currentMonth);
  
    // Adicionar interatividade (exibir detalhes ao clicar em um dia)
    calendarBody.addEventListener("click", function (event) {
      if (event.target.tagName === "TD" && event.target.textContent) {
        const day = event.target.textContent;
        selectedDayElement.textContent = day;
        dayDetails.classList.remove("hidden");
  
        // Simular dados para a tabela de detalhes
        const data = [
          { casa: "Casa A", valor: 100, odd: 1.5, resultado: "Ganho", lucro: 50 },
          { casa: "Casa B", valor: 200, odd: 2.0, resultado: "Perda", lucro: -200 },
        ];
  
        // Preencher a tabela de detalhes
        detailsTableBody.innerHTML = data
          .map(
            (item) => `
          <tr>
            <td>${item.casa}</td>
            <td>${item.valor}</td>
            <td>${item.odd}</td>
            <td>${item.valor * item.odd}</td>
            <td>${item.resultado}</td>
            <td>${item.lucro}</td>
          </tr>
        `
          )
          .join("");
  
        // Atualizar a tabela de resumo
        const totalInv = data.reduce((sum, item) => sum + item.valor, 0);
        const totalRet = data.reduce((sum, item) => sum + item.valor * item.odd, 0);
        const totalProf = data.reduce((sum, item) => sum + item.lucro, 0);
  
        totalInvestment.textContent = totalInv;
        totalPossibleReturn.textContent = totalRet;
        totalProfit.textContent = totalProf;
      }
    });
  });