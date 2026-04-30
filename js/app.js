let chart1, chart2, chart3;

document.getElementById("upload").addEventListener("change", handleFile);
document.getElementById("upload").addEventListener("change", function (e) {
  const label = document.querySelector(".upload-label");

  if (e.target.files.length > 0) {
    label.classList.add("active");
    label.innerHTML = `✅ ${e.target.files[0].name}`;
  }
});

function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  showLoading("Membaca file...");

  const reader = new FileReader();

  reader.onload = function (evt) {
    try {
      const data = new Uint8Array(evt.target.result);

      const workbook = XLSX.read(data, {
        type: "array",
      });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
      });

      processData(json);
    } catch (err) {
      alert("Gagal membaca file!");
      console.error(err);
    } finally {
      hideLoading();
    }
  };

  reader.readAsArrayBuffer(file);
}

function normalize(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\r/g, "")
    .replace(/\n/g, "")
    .replace(/\s+/g, " ");
}

function processData(data) {
  let perTanggal = {};
  let perJam = {};
  let total = {
    pedestrian: 0,
    vehicle: 0,
    unknown: 0,
  };

  data.forEach((row) => {
    // 🔥 auto detect header (aman walau beda nama)
    let rawTime = row.Time || row.time || row["Time "] || "";
    let origin = row.Origin || row.origin || "";

    if (!rawTime || !origin) return;

    origin = normalize(origin);

    let tanggal = "";
    let jam = "";

    try {
      if (typeof rawTime === "number") {
        let d = XLSX.SSF.parse_date_code(rawTime);

        tanggal = `${String(d.d).padStart(2, "0")}/${String(d.m).padStart(2, "0")}/${d.y}`;
        jam = String(d.H).padStart(2, "0") + ":00";
      } else {
        rawTime = rawTime.toString().trim();

        let parts = rawTime.split(" ");
        if (parts.length < 2) return;

        tanggal = parts[0];
        jam = parts[1].substring(0, 2) + ":00";
      }
    } catch (e) {
      console.log("ERROR TIME:", rawTime);
      return;
    }

    // INIT
    if (!perTanggal[tanggal]) {
      perTanggal[tanggal] = {
        pedestrian: 0,
        vehicle: 0,
        unknown: 0,
      };
    }

    if (!perJam[jam]) {
      perJam[jam] = {
        pedestrian: 0,
        vehicle: 0,
        unknown: 0,
      };
    }

    // 🔥 DETEKSI FIX
    if (origin.includes("pedestrian")) {
      perTanggal[tanggal].pedestrian++;
      perJam[jam].pedestrian++;
      total.pedestrian++;
    } else if (origin.includes("vehicle")) {
      perTanggal[tanggal].vehicle++;
      perJam[jam].vehicle++;
      total.vehicle++;
    } else {
      perTanggal[tanggal].unknown++;
      perJam[jam].unknown++;
      total.unknown++;
    }
  });

  console.log("HASIL:", perTanggal, perJam, total);

  if (Object.keys(perTanggal).length === 0) {
    alert("Data tidak terbaca! Cek kolom Time & Origin");
    return;
  }

  renderCharts(perTanggal, perJam, total);
  renderTables(perTanggal, perJam, total);
  window.perTanggalGlobal = perTanggal;
  window.perJamGlobal = perJam;
  window.totalGlobal = total;
}

function renderCharts(tanggalData, jamData, total) {
  if (chart1) chart1.destroy();
  if (chart2) chart2.destroy();
  if (chart3) chart3.destroy();

  const tgl = Object.keys(tanggalData).sort((a, b) => {
    return (
      new Date(a.split("/").reverse().join("-")) -
      new Date(b.split("/").reverse().join("-"))
    );
  });

  const jam = Object.keys(jamData).sort();

  // ===== TANGGAL =====
  chart1 = new Chart(document.getElementById("chartTanggal"), {
    type: "bar",
    data: {
      labels: tgl,
      datasets: [
        {
          label: "Pedestrian",
          data: tgl.map((d) => tanggalData[d].pedestrian),
        },
        {
          label: "Vehicle",
          data: tgl.map((d) => tanggalData[d].vehicle),
        },
        {
          label: "Unknown",
          data: tgl.map((d) => tanggalData[d].unknown),
        },
      ],
    },
  });

  // ===== PIE =====
  chart2 = new Chart(document.getElementById("chartPie"), {
    type: "pie",
    data: {
      labels: ["Pedestrian", "Vehicle", "Unknown"],
      datasets: [
        {
          data: [total.pedestrian, total.vehicle, total.unknown],
        },
      ],
    },
  });

  // ===== JAM =====
  chart3 = new Chart(document.getElementById("chartJam"), {
    type: "bar",
    data: {
      labels: jam,
      datasets: [
        {
          label: "Pedestrian",
          data: jam.map((j) => jamData[j].pedestrian),
        },
        {
          label: "Vehicle",
          data: jam.map((j) => jamData[j].vehicle),
        },
        {
          label: "Unknown",
          data: jam.map((j) => jamData[j].unknown),
        },
      ],
    },
  });
}

function renderTables(tanggalData, jamData, total) {
  const tglKeys = Object.keys(tanggalData).sort((a, b) => {
  return (
    new Date(a.split("/").reverse().join("-")) -
    new Date(b.split("/").reverse().join("-"))
  );
});
  const jamKeys = Object.keys(jamData).sort();

  

  // ===== TABLE JAM =====
  let jamHTML = "";
  Object.keys(jamData)
    .sort()
    .forEach((j) => {
      let d = jamData[j];
      jamHTML += `
            <tr>
                <td>${j}</td>
                <td>${d.pedestrian.toLocaleString()}</td>
                <td>${d.vehicle.toLocaleString()}</td>
                <td>${d.unknown.toLocaleString()}</td>
            </tr>
        `;
    });
  document.getElementById("tableJam").innerHTML = jamHTML;

  // ===== PAGINATION TANGGAL =====
  paginate(tglKeys, tanggalData, "tableTanggal", "paginationTanggal");

  // ===== PAGINATION JAM =====
  paginate(jamKeys, jamData, "tableJam", "paginationJam");

  // ===== TABLE SUMMARY =====
  const grandTotal = total.pedestrian + total.vehicle + total.unknown;

  document.getElementById("tableSummary").innerHTML = `
        <tr><td>Pedestrian</td><td>${total.pedestrian.toLocaleString()}</td></tr>
        <tr><td>Vehicle</td><td>${total.vehicle.toLocaleString()}</td></tr>
        <tr><td>Unknown</td><td>${total.unknown.toLocaleString()}</td></tr>
        <tr style="font-weight:bold; background:#eee;">
            <td>Grand Total</td>
            <td>${grandTotal.toLocaleString()}</td>
        </tr>
    `;
}

function paginate(dataKeys, dataObj, tableId, paginationId, rowsPerPage = 10) {
  let currentPage = 1;

  function renderPage(page) {
    currentPage = page;

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const pageData = dataKeys.slice(start, end);

    let html = "";

    pageData.forEach((key) => {
      const d = dataObj[key];
      html += `
                <tr>
                    <td>${key}</td>
                    <td>${d.pedestrian.toLocaleString()}</td>
                    <td>${d.vehicle.toLocaleString()}</td>
                    <td>${d.unknown.toLocaleString()}</td>
                </tr>
            `;
    });

    document.getElementById(tableId).innerHTML = html;

    renderPagination();
  }

  function renderPagination() {
    const totalPages = Math.ceil(dataKeys.length / rowsPerPage);

    let buttons = "";

    for (let i = 1; i <= totalPages; i++) {
      buttons += `
                <button onclick="goPage('${tableId}', ${i})"
                    style="margin:2px; ${i === currentPage ? "font-weight:bold;" : ""}">
                    ${i}
                </button>
            `;
    }

    document.getElementById(paginationId).innerHTML = buttons;
  }

  window[`goPage_${tableId}`] = function (page) {
  renderPage(page);
};

async function exportPDF() {
  showLoading("Membuat PDF...");

  try {
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("l", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    function addTitle(text) {
      const today = new Date().toLocaleDateString("id-ID");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text(text, 10, 10);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text("Generated: " + today, pageWidth - 60, 10);

      pdf.line(10, 12, pageWidth - 10, 12);
    }

    async function capture(el) {
      return await html2canvas(el, {
        scale: 3,
        useCORS: true,
      });
    }

    function addImageFit(canvas) {
      const img = canvas.toDataURL("image/png");

      let imgWidth = pageWidth - 20;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pageHeight - 30) {
        imgHeight = pageHeight - 30;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }

      pdf.addImage(
        img,
        "PNG",
        (pageWidth - imgWidth) / 2,
        20,
        imgWidth,
        imgHeight,
      );
    }

    function addLongImage(canvas) {
      const img = canvas.toDataURL("image/png");

      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 20;

      pdf.addImage(img, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 30;

      while (heightLeft > 0) {
        pdf.addPage();
        addTitle("Continued");

        position = heightLeft - imgHeight + 20;
        pdf.addImage(img, "PNG", 10, position, imgWidth, imgHeight);

        heightLeft -= pageHeight - 30;
      }
    }

    function formatNumber(num) {
      return num.toLocaleString("id-ID");
    }

    function createTable(title, dataObj, isJam = false) {
      let html = `
                <div style="padding:20px; font-family:Arial">
                    <h2>${title}</h2>
                    <table border="1" style="width:100%; border-collapse:collapse; font-size:12px;">
                        <thead>
                            <tr>
                                <th>${isJam ? "Jam" : "Tanggal"}</th>
                                <th>Pedestrian</th>
                                <th>Vehicle</th>
                                <th>Unknown</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

      Object.keys(dataObj)
        .sort()
        .forEach((key) => {
          let d = dataObj[key];
          html += `
                <tr>
                    <td>${key}</td>
                    <td>${formatNumber(d.pedestrian)}</td>
                    <td>${formatNumber(d.vehicle)}</td>
                    <td>${formatNumber(d.unknown)}</td>
                </tr>
            `;
        });

      html += `</tbody></table></div>`;
      return html;
    }

    const perTanggal = window.perTanggalGlobal;
    const perJam = window.perJamGlobal;
    const total = window.totalGlobal;

    // CHART TANGGAL
    addTitle("Traffic per Tanggal");
    addImageFit(await capture(chartTanggal));

    // TABLE TANGGAL
    pdf.addPage();
    addTitle("Detail Tanggal");

    let div1 = document.createElement("div");
    div1.innerHTML = createTable("Table Tanggal", perTanggal);
    document.body.appendChild(div1);

    addLongImage(await capture(div1));
    div1.remove();

    // PIE
    pdf.addPage();
    addTitle("Traffic Distribution");
    addImageFit(await capture(chartPie));

    // SUMMARY
    pdf.addPage();
    addTitle("Summary");

    let sumDiv = document.createElement("div");
    sumDiv.innerHTML = `
            <div style="padding:20px; font-family:Arial">
                <h2>Summary</h2>
                <table border="1" style="width:100%; border-collapse:collapse;">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Pedestrian</td><td>${formatNumber(total.pedestrian)}</td></tr>
                        <tr><td>Vehicle</td><td>${formatNumber(total.vehicle)}</td></tr>
                        <tr><td>Unknown</td><td>${formatNumber(total.unknown)}</td></tr>
                        <tr>
                            <td><b>Grand Total</b></td>
                            <td><b>${formatNumber(total.pedestrian + total.vehicle + total.unknown)}</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
    document.body.appendChild(sumDiv);

    addImageFit(await capture(sumDiv));
    sumDiv.remove();

    // CHART JAM
    pdf.addPage();
    addTitle("Traffic per Jam");
    addImageFit(await capture(chartJam));

    // TABLE JAM
    pdf.addPage();
    addTitle("Detail Jam");

    let div2 = document.createElement("div");
    div2.innerHTML = createTable("Table Jam", perJam, true);
    document.body.appendChild(div2);

    addLongImage(await capture(div2));
    div2.remove();

    pdf.save("Traffic-report.pdf");
  } catch (err) {
    console.error(err);
    alert("Gagal export PDF!");
  } finally {
    hideLoading();
  }
}

function showLoading(text = "Processing...") {
  document.getElementById("loadingOverlay").style.display = "flex";
  document.getElementById("loadingText").innerText = text;
}

function hideLoading() {
  document.getElementById("loadingOverlay").style.display = "none";
}
